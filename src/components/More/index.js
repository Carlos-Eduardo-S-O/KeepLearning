import React from 'react'
import { ScrollView, TouchableOpacity, View, Share} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { displayName as appName } from '../../../app.json'
import SyncStorage from 'sync-storage'

import {
    MenuOption,
    ContainerMenu,
    MenuDivisor,
    RightOnTheSameLine,
    IconContainer
} from '../../assents/style'

export default class More extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
            close: this.props.close,
            feed: this.props.feed, 
            navigator: this.props.navigator
        }
    }

    openScreen = (id) => {
        const { navigator } = this.state
        const user = SyncStorage.get("user")
        
        if (user){
            navigator.navigate("Comments", {feedId: id})
        } else {
            navigator.navigate("CommentsWithoutLogin", {feedId: id})
        }
    }

    showOptions = () => {
        const { close, feed } = this.state
        
        return(
            <View> 
                <TouchableOpacity
                        onPress={ 
                            () => {
                                this.openScreen(feed._id)
                                close()
                            }
                        }
                        
                > 
                    <RightOnTheSameLine style={{paddingLeft: 3}} >
                        <IconContainer>
                            <Icon 
                                name="comments-o"
                                size={20}
                            />
                        </IconContainer>
                        <MenuOption>Comentários</MenuOption>
                    </RightOnTheSameLine> 
                    <MenuDivisor/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={
                        () => {
                            this.toShare()
                            close()
                        }
                    }
                    
                >   
                    <RightOnTheSameLine style={{paddingLeft: 3}} >
                        <IconContainer>
                            <Icon 
                                name="share-square-o"
                                size={20}
                            />
                        </IconContainer>
                        <MenuOption>Compartilhar</MenuOption>
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
                    {"Mais opções"}
                </MenuOption>
            </RightOnTheSameLine>
        )
    }

    toShare = () => {
        const {feed} = this.state

        const message = feed.course.url +

        "\n\nEnviado por " + appName + 
            "\nBaixe agora: http://play.google.com/store"

        const result = Share.share({
            title: feed.course.name +"\n"+feed.site.name,
            message: message
        })
    }
 
    render = () => {
        const {feed} = this.state
        
        if(feed){
            return(
                <ScrollView> 
                    <ContainerMenu>
                        {this.showMenuDescription()}
                    </ContainerMenu>
                    <ContainerMenu >
                        {this.showOptions()}
                    </ContainerMenu>    
                </ScrollView>
            )
        } else {
            return null
        }
    }
}