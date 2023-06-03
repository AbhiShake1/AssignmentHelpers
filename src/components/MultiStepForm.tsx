import React, {useState} from 'react';
import {
    Button,
    Step,
    StepConnector,
    stepConnectorClasses,
    type StepIconProps,
    StepLabel,
    Stepper,
} from '@mui/material';
import {styled} from "@mui/joy";
import {Check} from "@mui/icons-material";
import {useAutoAnimate} from "@formkit/auto-animate/react";


interface Props {
    steps: { step: string, child: React.ReactNode }[]
    onSubmit?: React.FormEventHandler<HTMLFormElement>
}

const QontoConnector = styled(StepConnector)(({theme}) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? 'gray' : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}))

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({theme, ownerState}) => ({
        color: theme.palette.mode === 'dark' ? 'gray' : '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        ...(ownerState.active && {
            color: '#784af4',
        }),
        '& .QontoStepIcon-completedIcon': {
            color: '#784af4',
            zIndex: 1,
            fontSize: 18,
        },
        '& .QontoStepIcon-circle': {
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
    }),
);

function QontoStepIcon(props: StepIconProps) {
    const {active, completed, className} = props;

    return (
        <QontoStepIconRoot ownerState={{active}} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon"/>
            ) : (
                <div className="QontoStepIcon-circle"/>
            )}
        </QontoStepIconRoot>
    );
}

const MultiStepForm: React.FC<Props> = ({steps, onSubmit}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [animation] = useAutoAnimate({duration: 200, disrespectUserMotionPreference: true})

    const handleNext = () => {
        setActiveStep(s => s == steps.length + 1 ? steps.length : s + 1)
    }

    const handleBack = () => {
        setActiveStep(s => s == 0 ? 0 : s - 1)
    }

    return (
        <div className="w-96 mx-auto mb-8">
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector/>}>
                {
                    steps.map((e) => (
                        <Step key={e.step}>
                            <StepLabel StepIconComponent={QontoStepIcon}>{e.step}</StepLabel>
                        </Step>
                    ))
                }
            </Stepper>

            <form className="mt-8 space-y-4" ref={animation} onSubmit={onSubmit}>
                {steps[activeStep]?.child}
                <div className="flex flex-row space-x-6" ref={animation}>
                    {activeStep > 0 && <Button onClick={handleBack} variant='outlined'>back</Button>}
                    <Button onClick={handleNext} variant='contained'
                            type={activeStep == steps.length + 1 ? 'submit' : 'button'}
                            style={{backgroundColor: 'blue'}}>{activeStep >= steps.length ? 'finish' : 'next'}</Button>
                </div>
            </form>
        </div>
    );
};

export default MultiStepForm;