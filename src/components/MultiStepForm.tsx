import React, {useState} from 'react';
import {
    Button,
    Step,
    StepConnector,
    stepConnectorClasses,
    type StepIconProps,
    StepLabel,
    Stepper,
    TextField
} from '@mui/material';
import {styled} from "@mui/joy";
import {Check} from "@mui/icons-material";

const steps = ['Account Setup', 'Social Profiles', 'Personal Details'];

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

const MultiStepForm = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div className="w-96 mx-auto">
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector/>}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <form className="mt-8 space-y-4">
                {activeStep === 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold">Create your account</h2>
                        <h3 className="text-lg font-medium">This is step 1</h3>
                        <TextField label="Email" variant="outlined" fullWidth/>
                        <TextField label="Password" variant="outlined" type="password" fullWidth/>
                        <TextField label="Confirm Password" variant="outlined" type="password" fullWidth/>
                    </div>
                )}

                {activeStep === 1 && (
                    <div>
                        <h2 className="text-2xl font-semibold">Social Profiles</h2>
                        <h3 className="text-lg font-medium">Your presence on the social network</h3>
                        <TextField label="Twitter" variant="outlined" fullWidth/>
                        <TextField label="Facebook" variant="outlined" fullWidth/>
                        <TextField label="Google Plus" variant="outlined" fullWidth/>
                    </div>
                )}

                <div className="flex justify-between">
                    {activeStep !== 0 && (
                        <Button variant="outlined" onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    <Button variant="contained" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MultiStepForm;