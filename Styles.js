import MarerialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from "styled-components/native";


export const AppLogo = styled(MarerialCommunityIcons)`
  color: #1A1A1A;
  margin-bottom: 20px;
`
export const RegisterButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    color: white;
    background-color: #1A1A1A;
    width: 90%;
    height: 5%;
    margin-bottom: 10px;
    border-radius: 5px;
`
export const LoginButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    color: white;
    background-color: #1A1A1A;
    width: 90%;
    height: 5%;
    border-radius: 5px;
`
export const RegistrationContaier = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

export const AppLogoContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`

export const RegLogTextInput = styled.TextInput`
    border-bottom-width: 1px;
    margin-bottom: 20px;
    margin-right: 5px;
    margin-left: 5px;
`

export const SignButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    color: white;
    background-color: #1A1A1A;
    width: 90%;
    height: 5%;
    border-radius: 5px;
`
export const UserAvatar = styled.Image`
    height: 50px;
    width: 50px;
    border-radius: 30px;
`
export const UserProfileAvatar = styled.Image`
    height: 75px;
    width: 75px;
    border-radius: 40px;
`
export const UserAvatarComments = styled.Image`
    height: 40px;
    width: 40px;
    border-radius: 30px;
`
export const PostCreatorInfo = styled.View`
    flex-direction: row;
    margin-left: 5px; 
    align-items: center;
    margin-bottom: 3px;
`
export const NickName = styled.Text`
    font-weight: 700;
`
export const UserProfileMainInfo = styled.View`
    flex-direction: row;
`