import AuthForm from "@/components/forms/AuthForm";

const SignIn = () => {
  return (
    <section className="flex-center size-full md:py-6">
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
