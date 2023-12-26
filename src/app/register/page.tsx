import RegisterForm from './components/RegisterForm';

const RegisterUserPage = () => {
    return (
        <div className="relative flex h-svh  items-center justify-center lg:px-0">
            <div className="w-full">
                <div className="mx-auto flex w-full max-w-2xl flex-col justify-center space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Register a new account</h1>
                        <p className="text-sm text-muted-foreground">
                            To create a new account, you need to fill out the form below.
                        </p>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default RegisterUserPage;
