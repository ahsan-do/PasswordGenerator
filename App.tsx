import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import * as Yup from 'yup';
import { Formik } from 'formik';

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(8, 'Should be min of 8 characters')
    .max(16, 'Should be max of 16 characters')
    .required('Length is required'),
});

export default function App() {
  const [password, setPassword] = useState('');
  const [isPassGenerated, setIsPassGenerated] = useState(false);

  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatePasswordString = (passwordLength: number) => {
    let characterList = '';

    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    if (upperCase) characterList += upperCaseChars;
    if (lowerCase) characterList += lowerCaseChars;
    if (numbers) characterList += digitChars;
    if (symbols) characterList += specialChars;

    const passwordResult = createPassword(characterList, passwordLength);
    setPassword(passwordResult);
    setIsPassGenerated(true);
  };

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const resetPasswordState = () => {
    setPassword('');
    setIsPassGenerated(false);
    setLowerCase(true);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={PasswordSchema}
            onSubmit={(values) => {
              generatePasswordString(parseInt(values.passwordLength));
              Keyboard.dismiss();
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>
                    <View style={styles.errorContainer}>
                    {touched.passwordLength && errors.passwordLength ? (
                      <Text style={styles.errorText}>{errors.passwordLength}</Text>
                    ) : null}
                    </View>
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="8"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapperCheck}>
                  <Text style={styles.heading}>Include lowercase</Text>
                  <BouncyCheckbox
                    isChecked={lowerCase}
                    onPress={() => setLowerCase(!lowerCase)}
                    fillColor="#29Ab87"
                  />
                </View>
                <View style={styles.inputWrapperCheck}>
                  <Text style={styles.heading}>Include uppercase</Text>
                  <BouncyCheckbox
                    isChecked={upperCase}
                    onPress={() => setUpperCase(!upperCase)}
                    fillColor="#29Ab87"
                  />
                </View>
                <View style={styles.inputWrapperCheck}>
                  <Text style={styles.heading}>Include numbers</Text>
                  <BouncyCheckbox
                    isChecked={numbers}
                    onPress={() => setNumbers(!numbers)}
                    fillColor="#29Ab87"
                  />
                </View>
                <View style={styles.inputWrapperCheck}>
                  <Text style={styles.heading}>Include symbols</Text>
                  <BouncyCheckbox
                    isChecked={symbols}
                    onPress={() => setSymbols(!symbols)}
                    fillColor="#29Ab87"
                  />
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.primaryBtnTxt}>Generate Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPasswordState();
                    }}
                  >
                    <Text style={styles.secondaryBtnTxt}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
        {isPassGenerated && (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.subTitle}>Result:</Text>
            <Text style={styles.description}>Long press to copy</Text>
            <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
          </View>
        )}
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#1c1c1e', // Dark background for a modern look
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#2c2c2e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#f5f5f7',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f5f5f7',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: '#8e8e93',
    marginBottom: 16,
    textAlign: 'center',
  },
  heading: {
    fontSize: 16,
    color: '#f5f5f7',
    marginBottom: 8,
  },
  inputWrapper: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputWrapperCheck: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputColumn: {
    flexDirection: 'column',
  },
  inputStyle: {
    padding: 10,
    width: '30%',
    backgroundColor: '#3a3a3c',
    color: '#f5f5f7',
    borderRadius: 8,
    borderColor: '#525256',
    borderWidth: 1,
    textAlign: 'center',
  },

  errorContainer:{
    width: 200
  },

  errorText: {
    fontSize: 12,
    color: '#ff453a',

  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#34c759',
  },
  primaryBtnTxt: {
    color: '#f5f5f7',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#ff453a',
  },
  secondaryBtnTxt: {
    color: '#f5f5f7',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    margin: 'auto'
  },
  card: {
    marginTop: 34,
    marginHorizontal: 12,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2c2c2e',
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  generatedPassword: {
    fontSize: 24,
    textAlign: 'center',
    color: '#0a84ff',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 10,
  },
});

