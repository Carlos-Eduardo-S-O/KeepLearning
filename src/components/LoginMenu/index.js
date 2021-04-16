import React from 'react'
import { ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { LoginOptionsMenu } from '../Login'
import staticFeeds from '../../assents/dictionaries/websites.json'
import Toast from 'react-native-simple-toast'

import {
    MenuOption,
    ContainerMenu,
    RightOnTheSameLine,
} from '../../assents/style'

import { SafeAreaView } from 'react-native-safe-area-context'

export default class LoginMenu extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
            toRefresh: true,
            filter: props.filter,
            close: props.close
        }
    }

    showMenuDescription = () => {
        return(
            <RightOnTheSameLine style={
                {
                    borderBottomWidth: 1,
                    borderColor: "#888",
                    padding: 8
                }}>
                <MenuOption 
                    style={
                        {
                            padding: 4,
                            height: 36,
                            width: 250,
                            fontSize: 18
                        }}>
                    <Icon
                        name="user"
                        size={20}
                        />        
                    {"  Menu de login"}
                </MenuOption>
            </RightOnTheSameLine>
        )
    }

    onLogin = (user) => {
        const { close } = this.state

        this.setState({
            toRefresh: true
        }, 
        () => {
            Toast.show("Você foi logado com sucesso na sua conta " + user.signer,
                Toast.LONG
            )
        })
        close()
    }

    onLogout = (service) => {
        const { close } = this.state

        this.setState({
            toRefresh: true
        },
        () => {
            Toast.show("Você foi deslogado com sucesso da sua conta " + service, 
                Toast.LONG
            )
        })
        close()
    }
    
    render = () => {
        const websites = staticFeeds.sites
        
        return(
            <SafeAreaView>
                <ScrollView> 
                    <ContainerMenu>
                        {this.showMenuDescription()}
                    </ContainerMenu>
                    <ContainerMenu >
                        <LoginOptionsMenu onLogin={this.onLogin} onLogout={this.onLogout}/>  
                    </ContainerMenu>    
                </ScrollView>
            </SafeAreaView>
        )
    }
}
