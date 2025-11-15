import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

// Email validation regex
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 8 chars, one uppercase, one lowercase, one number
const validatePassword = (password) => {
  // regex function written by other devs which uses the password regex to validate the password entered
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Field-level errors
  const [firstNameError, setFirstNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [verificationError, setVerificationError] = React.useState("");

  // Validation functions

  //   if nothing is entered in the input field, the fuction returns false and also if something is entered but less than 2 characters the function returns false
  const validateFirstNameField = () => {
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      return false;
    }
    if (firstName.length < 2) {
      setFirstNameError("First name must be at least 2 characters");
      return false;
    }
    setFirstNameError("");
    return true;
  };

  const validateLastNameField = () => {
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      return false;
    }
    if (lastName.length < 2) {
      setLastNameError("Last name must be at least 2 characters");
      return false;
    }
    setLastNameError("");
    return true;
  };

  const validateEmailField = () => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePasswordField = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters with uppercase, lowercase, and number"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateVerificationCodeField = () => {
    if (!verificationCode.trim()) {
      setVerificationError("Verification code is required");
      return false;
    }
    if (verificationCode.length < 6) {
      setVerificationError("Verification code should be 6 digits");
      return false;
    }
    setVerificationError("");
    return true;
  };

  // Step 1: Create the user account
  const onSignUpPress = async () => {
    setError("");

    // Validate all fields
    const firstNameValid = validateFirstNameField();
    const lastNameValid = validateLastNameField();
    const emailValid = validateEmailField();
    const passwordValid = validatePasswordField();

    if (!firstNameValid || !lastNameValid || !emailValid || !passwordValid) {
      return;
    }

    if (!isLoaded) return;

    // This ensures that you do NOT run any Clerk logic until the sign-up module is fully ready.

    setLoading(true);
    try {
      // Create the user account with email and password
      await signUp.create({
        emailAddress: email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Send verification code to user's email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Show verification code input
      setPendingVerification(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the email address with the code
  const onVerifyPress = async () => {
    setError("");

    if (!validateVerificationCodeField()) {
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      // Verify the email with the code the user entered
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      // If verification successful, set the session as active
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // User is now signed up and signed in automatically
      } else {
        console.log("Verification incomplete:", signUpAttempt);
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Show verification code input if we're waiting for verification
  if (pendingVerification) {
    return (
      // to make the keyboard not to cover the input field thats why we wrap keyboardAvoidingView
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We sent a verification code to {email}
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={[styles.input, verificationError && styles.inputError]}
                value={verificationCode}
                onChangeText={(text) => {
                  setVerificationCode(text);
                  setVerificationError("");
                }}
                onBlur={validateVerificationCodeField}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
              {verificationError ? (
                <Text style={styles.fieldError}>{verificationError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onVerifyPress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPendingVerification(false)}>
              <Text style={styles.backLink}>Back to Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Show initial sign-up form
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us today</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* First Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, firstNameError && styles.inputError]}
              placeholder="Enter your first name"
              placeholderTextColor="#9ca3af"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                setFirstNameError("");
              }}
              onBlur={validateFirstNameField}
              editable={!loading}
            />
            {firstNameError ? (
              <Text style={styles.fieldError}>{firstNameError}</Text>
            ) : null}
          </View>

          {/* Last Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, lastNameError && styles.inputError]}
              placeholder="Enter your last name"
              placeholderTextColor="#9ca3af"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setLastNameError("");
              }}
              onBlur={validateLastNameField}
              editable={!loading}
            />
            {lastNameError ? (
              <Text style={styles.fieldError}>{lastNameError}</Text>
            ) : null}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              onBlur={validateEmailField}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {emailError ? (
              <Text style={styles.fieldError}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  passwordError && styles.inputError,
                ]}
                placeholder="At least 8 chars, uppercase, lowercase, number"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                onBlur={validatePasswordField}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showPasswordButton}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.fieldError}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onSignUpPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: 20,
  },
  content: {
    padding: 20,
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  fieldError: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
  },
  showPasswordButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  showPasswordText: {
    color: "#6366f1",
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 8,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signInText: {
    color: "#6b7280",
    fontSize: 14,
  },
  signInLink: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
  backLink: {
    color: "#6366f1",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 20,
  },
  error: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 14,
    overflow: "hidden",
  },
});
