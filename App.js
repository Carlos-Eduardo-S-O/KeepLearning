import React from 'react'

import { StatusBar } from 'react-native'
import { MenuProvider} from 'react-native-popup-menu'

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Feeds from './src/screens/Feeds'
import Details from './src/screens/Details'
import Comments from './src/screens/Comments'
import CommentsWithoutLogin from './src/screens/CommentsWithoutLogin'

const Navigator = createStackNavigator(
    {
        Feeds: { screen : Feeds },
        Details: { screen : Details},
        Comments: { screen : Comments},
        CommentsWithoutLogin: { screen : CommentsWithoutLogin}
    },
    {
        headerMode: 'none'
    }
)

const Container = createAppContainer(Navigator)

export default function App(){
    return(      
        <MenuProvider>
            <StatusBar barStyle="dark-content"/>
            <Container/>
        </MenuProvider>  
    )
}
