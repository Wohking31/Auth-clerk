// screens/auth/SignUpScreen.jsx - WITH CLERK AUTHENTICATION & VERIFICATION

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp } from "@clerk/clerk-expo";
import colors from "../../constants/colors";

// Email validation regex
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 8 chars, one uppercase, one lowercase, one number
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export default function SignUpScreen({ navigation }) {
  const { signUp, setActive, isLoaded } = useSignUp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Field-level errors
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [verificationError, setVerificationError] = useState("");

  // Validation functions
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

  const validateConfirmPasswordField = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
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
  const handleSignUp = async () => {
    setError("");

    const firstNameValid = validateFirstNameField();
    const lastNameValid = validateLastNameField();
    const emailValid = validateEmailField();
    const passwordValid = validatePasswordField();
    const confirmPasswordValid = validateConfirmPasswordField();

    if (
      !firstNameValid ||
      !lastNameValid ||
      !emailValid ||
      !passwordValid ||
      !confirmPasswordValid
    ) {
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      // Create the user account
      await signUp.create({
        emailAddress: email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Send verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Show verification screen
      setPendingVerification(true);
    } catch (err) {
      const errorMessage =
        err.errors?.[0]?.message || "Sign up failed. Please try again.";
      setError(errorMessage);
      Alert.alert("Sign Up Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the email with code

  // In onVerifyPress function:

  const onVerifyPress = async () => {
    setError("");

    if (!validateVerificationCodeField()) {
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // Navigation happens automatically - DO NOT call navigation.reset()
      } else {
        console.log("Verification incomplete:", signUpAttempt);
      }
    } catch (err) {
      const errorMessage = err.errors?.[0]?.message || "Verification failed";
      setError(errorMessage);
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show verification code screen
  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setPendingVerification(false)}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We sent a verification code to {email}
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Verification Code Input */}
          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                verificationError && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="key-outline"
                size={20}
                color={verificationError ? "#DC2626" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                value={verificationCode}
                onChangeText={(text) => {
                  setVerificationCode(text);
                  setVerificationError("");
                  setError("");
                }}
                onBlur={validateVerificationCodeField}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
            </View>
            {verificationError ? (
              <Text style={styles.fieldError}>{verificationError}</Text>
            ) : null}

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
              onPress={onVerifyPress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            {/* Back to Sign Up Link */}
            <TouchableOpacity
              style={styles.backToSignUpContainer}
              onPress={() => setPendingVerification(false)}
              disabled={loading}
            >
              <Text style={styles.backToSignUpText}>Back to Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Show initial sign-up form
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to get started!</Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Input Fields */}
        <View style={styles.form}>
          {/* First Name Input */}
          <View
            style={[
              styles.inputContainer,
              firstNameError && styles.inputContainerError,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={firstNameError ? "#DC2626" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                setFirstNameError("");
                setError("");
              }}
              onBlur={validateFirstNameField}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
          {firstNameError ? (
            <Text style={styles.fieldError}>{firstNameError}</Text>
          ) : null}

          {/* Last Name Input */}
          <View
            style={[
              styles.inputContainer,
              lastNameError && styles.inputContainerError,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={lastNameError ? "#DC2626" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setLastNameError("");
                setError("");
              }}
              onBlur={validateLastNameField}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
          {lastNameError ? (
            <Text style={styles.fieldError}>{lastNameError}</Text>
          ) : null}

          {/* Email Input */}
          <View
            style={[
              styles.inputContainer,
              emailError && styles.inputContainerError,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={emailError ? "#DC2626" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
                setError("");
              }}
              onBlur={validateEmailField}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
          {emailError ? (
            <Text style={styles.fieldError}>{emailError}</Text>
          ) : null}

          {/* Password Input */}
          <View
            style={[
              styles.inputContainer,
              passwordError && styles.inputContainerError,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={passwordError ? "#DC2626" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
                setError("");
              }}
              onBlur={validatePasswordField}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.fieldError}>{passwordError}</Text>
          ) : null}

          {/* Confirm Password Input */}
          <View
            style={[
              styles.inputContainer,
              confirmPasswordError && styles.inputContainerError,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={confirmPasswordError ? "#DC2626" : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError("");
                setError("");
              }}
              onBlur={validateConfirmPasswordField}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text style={styles.fieldError}>{confirmPasswordError}</Text>
          ) : null}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.primaryButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          {/* Google Sign Up Button */}
          <TouchableOpacity
            style={styles.googleButton}
            disabled={loading}
            onPress={() => Alert.alert("Google Sign Up", "Coming soon!")}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.googleButtonText}>Sign up using Google</Text>
          </TouchableOpacity>

          {/* Log In Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already member? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn")}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#DC2626",
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  inputContainerError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  fieldError: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 56,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  googleButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#999",
  },
  loginLink: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: "600",
  },
  backToSignUpContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  backToSignUpText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: "600",
  },
});
