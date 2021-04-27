import React from 'react'
import { ScrollView, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getImage, getWebsites } from '../../api/'

import {
    Avatar,
    MenuOption,
    ContainerMenu,
    MenuDivisor,
    RightOnTheSameLine,
} from '../../assets/style'

export default class Menu extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
            filter: props.filter,
            websites: []
        }
    }

    componentDidMount = () => {
        getWebsites().then((moreWebsites) => {
            this.setState({
                websites: moreWebsites
            })
        }).catch((error) => {
            console.error("Something goes wrong: " + error)
        })
    }

    showWebsite = (website) => {
        const { filter } = this.state

        return(<View>
            <TouchableOpacity
                    onPress={
                        () => {
                            filter(website)
                        }
                    }
                    
                >
                    <RightOnTheSameLine style={{ paddingLeft: 3 }} >
                        <Avatar source={getImage(website.avatar)}/>
                        <MenuOption>{website.name}</MenuOption>
                    </RightOnTheSameLine> 
                    <MenuDivisor/>
            </TouchableOpacity> 
        </View>   
        )
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
                        name="sliders"
                        size={20}
                        />        
                    {"  Filtrar por websites"}
                </MenuOption>
            </RightOnTheSameLine>
        )
    }

    render = () => {
        const { websites } = this.state
        
        return(
            <SafeAreaView>
                <ScrollView> 
                    <ContainerMenu>
                        {this.showMenuDescription()}
                    </ContainerMenu>
                    <ContainerMenu >
                        {websites.map((website) => this.showWebsite(website))}  
                    </ContainerMenu>    
                </ScrollView>
            </SafeAreaView>
        )
    }
}