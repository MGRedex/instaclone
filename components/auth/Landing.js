import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styled from "styled-components/native";
import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AppLogo, AppLogoContainer, AppName, LoginButton, RegisterButton, RegistrationContaier } from '../../Styles';

export default function LandingScreen({navigation}) {
    return (
        <RegistrationContaier>
            <AppLogo name="instagram" size={70}/>
            <RegisterButton onPress={() => navigation.navigate('Register')}>
                <Text style={{color: 'white'}}>Register</Text>
            </RegisterButton>
            <LoginButton onPress={() => navigation.navigate('Login')}>
                <Text style={{color: 'white'}}>Login</Text>
            </LoginButton>
        </RegistrationContaier>
    )
}

