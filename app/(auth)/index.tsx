import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { CodeField } from "react-native-confirmation-code-field";
import { Formik } from "formik";
import { signUpSchema } from "@/validationschema";
import { useSetPassword, useSignUp } from "@/hooks/apihook/authhook";
import { colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const SignUpScreen = () => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupMutation = useSignUp();
  const setPasswordMutation = useSetPassword();

  const router = useRouter();

  const handleNextStep = (email: string) => {
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2 && verificationCode) {
      const payload = { email, validationcode: verificationCode };
      console.log(payload);

      signupMutation.mutate(payload, {
        onSuccess: () => {
          setStep(3);
        },
        onError: () => {
          setStep(2);
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Step {step} of 3</Text>
      </View>

      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signUpSchema}
        //onSubmit={(values) => handleSignUp(values)}
        onSubmit={(values) => {
          setPasswordMutation.mutate(values);
          console.log(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.label}>Enter your email address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNextStep(values.email)}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.label}>
                  Enter the verification code sent to your email
                </Text>
                <CodeField
                  cellCount={6}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      key={index}
                      style={[styles.codeCell, isFocused && styles.focusedCell]}
                    >
                      <Text style={styles.codeText}>{symbol}</Text>
                    </View>
                  )}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNextStep(values.email)}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.label}>Create a password</Text>
                <View>
                  <Text style={styles.labelTxt}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Must be 8 characters"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!showPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.eyeIcon}>
                        {showPassword ? "👁" : "👁‍🗨"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.labelTxt}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Confirm password"
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      secureTextEntry={!showConfirmPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Text style={styles.eyeIcon}>
                        {showConfirmPassword ? "👁" : "👁‍🗨"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit()}
                  disabled={setPasswordMutation.status === "pending"}
                >
                  {setPasswordMutation.status === "pending" ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Sign up</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </Formik>
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => router.navigate("/(auth)/SigninScreen")}
        >
          <Text style={styles.signInLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  header: {
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign:'center',
    marginTop:20
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop:10
  },
  stepContainer: {
    flex: 1,
    marginTop:20
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.blueGronto,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  codeCell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  focusedCell: {
    borderColor: "#007bff",
  },
  codeText: {
    fontSize: 18,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    paddingRight: 16,
    fontSize: 20,
  },
  labelTxt: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 9,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signInText: {
    color: "#6B7280",
  },
  signInLink: {
    color: "#2563EB",
  },
});

export default SignUpScreen;
