import React, {useState} from 'react';
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {toast} from "react-hot-toast";
import {Button, Stepper} from "@mantine/core";


interface Props {
    steps: {
        step: string, child: React.ReactNode, onNext?: (count: number) => void
        onPrevious?: (count: number) => void,
    }[]
    onSubmit?: React.FormEventHandler<HTMLFormElement>
}

const MultiStepForm: React.FC<Props> = ({steps, onSubmit}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [animation] = useAutoAnimate({duration: 200, disrespectUserMotionPreference: true})

    const step = steps[activeStep]
    const handleNext = () => {
        setActiveStep(s => {
            try {
                if (step?.onNext) step.onNext(s)
                return s == steps.length + 1 ? steps.length : s + 1
            } catch (e) {
                if (e) toast.error(e.toString())
                return s
            }
        })
    }

    const handleBack = () => {
        setActiveStep(s => {
            try {
                if (step?.onPrevious) step.onPrevious(s)
                return s == 0 ? 0 : s - 1
            } catch (e) {
                if (e) toast.error(e.toString())
                return s
            }
        })
    }

    return (
        <div className="mx-auto mb-8">
            <Stepper active={activeStep}>
                {
                    steps.map((e, i) => (
                        <Stepper.Step label={e.step} key={i} ref={animation}>
                            {e.child}
                        </Stepper.Step>
                    ))
                }
            </Stepper>

            <form className="mt-8 space-y-4" ref={animation} onSubmit={(e) => {
                e.preventDefault()
                if (onSubmit) onSubmit(e)
            }}>
                <div className="flex flex-row space-x-6" ref={animation}>
                    {activeStep > 0 && <Button onClick={handleBack} variant='subtle'>Back</Button>}
                    <Button onClick={handleNext} variant='outline'
                            type={activeStep == steps.length + 1 ? 'submit' : 'button'}
                    >{activeStep >= steps.length ? 'Finish' : 'Next'}</Button>
                </div>
            </form>
        </div>
    );
};

export default MultiStepForm;