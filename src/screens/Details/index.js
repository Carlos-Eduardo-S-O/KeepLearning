import React from 'react'
import { View, Button, Linking } from 'react-native'
import { SliderBox } from 'react-native-image-slider-box'
import CardView from 'react-native-cardview'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather'
import DrawerLayout from 'react-native-drawer-layout'
import { SafeAreaView } from 'react-native-safe-area-context'
import More from '../../components/More'

import staticFeeds from '../../assents/dictionaries/feed.json'
import slide1 from '../../assents/imgs/slide1.jpeg'
import slide2 from '../../assents/imgs/slide2.jpeg'
import slide3 from '../../assents/imgs/slide3.jpg'
import avatar from '../../assents/imgs/logo.jpg'

import {
    Avatar,
    Title,
    Title2,
    Description,
    OnTheSameLine,
    RightOnTheSameLine,
    Container,
    Justify,
    ButtonContainer
} from '../../assents/style'

export default class Details extends React.Component{
    
    constructor(props){
        super(props)

        this.hideMoreMenu = this.hideMoreMenu.bind(this)

        this.state = {
            navigator: this.props.navigation.state.params.navigator,
            feedId: this.props.navigation.state.params.feedId,
            feed: null
        }
    }

    loadFeeds = () => {
        const { feedId } = this.state

        const feeds = staticFeeds.feeds
        const filteredFeeds = feeds.filter((feed) => feed._id === feedId)

        if (filteredFeeds.length){
            this.setState({
                feed: filteredFeeds[0]
            })
        }
    }

    showTextContainer  = () => {
        const { feed } = this.state
        
        if (feed){
            return(
                <View>    
                    <Container>
                        <OnTheSameLine>
                            <Avatar source={avatar}/>
                            <Title>{feed.site.name}</Title>
                        </OnTheSameLine> 
                    </Container>
                    
                    <Container>
                        <Title>{feed.course.name}</Title>
                    </Container>
                     
                    <Container>
                        <Description>{feed.course.description}</Description> 
                    </Container>

                    <Container>
                        <Justify>
                            <OnTheSameLine>
                                <Title2>Duração: </Title2>
                                <Description>{feed.course.duration}</Description>
                            </OnTheSameLine>

                            <OnTheSameLine>   
                                <Title2>Idioma: </Title2>
                                <Description>{feed.course.language} </Description>
                            </OnTheSameLine>

                            <OnTheSameLine>
                                <Title2>Nível: </Title2>
                                <Description>{feed.course.level}</Description>
                            </OnTheSameLine> 
                        </Justify>
                    </Container>
                </View>
            )
        }else{
            return (null)
        }
        
    }

    showSlides = () => {
        slides = [ slide1, slide2, slide3 ]

        return(
            <SliderBox
                dotColor={"#ffad05"}
                inactiveDotColor={"#5995ed"}
                
                resizeMethod={"resize"}
                resizeMode={"cover"}

                dotStyle={{
                    width: 15,
                    height: 15,

                    borderRadius: 15,
                    marginHorizontal: 5
                }}
                images={slides}
            />
        )
    }

    showHeader = () => {
        const { feed } = this.state
            
        siteName = feed.site.name
        
        return(
            <Header backgroundColor="#fff"
                leftComponent={
                    <RightOnTheSameLine>
                        <Icon 
                            size={28}
                            name="chevron-left"
                            onPress={
                                () => {
                                    this.props.navigation.goBack()
                                }
                            }
                        />
                    </RightOnTheSameLine> 
                }

                centerComponent={  
                    <RightOnTheSameLine>
                        <Title style={{fontSize: 18}}>Detalhes do Curso</Title>
                    </RightOnTheSameLine>      
                }

                rightComponent={
                    <RightOnTheSameLine>
                        <Icon 
                            size={26}
                            name="more-vertical"
                            onPress={
                                () => {
                                    this.menu.openDrawer()
                                }
                            }
                        />
                    </RightOnTheSameLine>
                }
            />
        )
    }

    showButton = () => {
        const { feed } = this.state
        
        return(
            <ButtonContainer>
                 <Button 
                    title="Acessar Curso"
                    onPress={
                        () =>{
                            Linking.openURL(feed.course.url)
                        }
                    }
                 />
            </ButtonContainer>
        )
    }

    componentDidMount = () => {
        this.loadFeeds()
    }
    
    hideMoreMenu = () => {
        this.menu.closeDrawer()
    }

    render(){
        const { feed, navigator } = this.state

        if (feed){
            return(
                <DrawerLayout
                    drawerWidth={250}
                    drawerPosition={DrawerLayout.positions.Right}

                    ref={drawerElement => {
                        this.menu = drawerElement
                    }}

                    renderNavigationView={() => <SafeAreaView><More close={this.hideMoreMenu} feed={feed} navigator={navigator}/></SafeAreaView>}
                >
                    <View>
                        {this.showHeader()}
                        <CardView
                            cardElevation={2}
                            cornerRadius={0}
                        >
                            {this.showSlides()}
                        </CardView>
                        <CardView>
                            {this.showTextContainer()}
                        </CardView>
                        <CardView>
                            {this.showButton()}
                        </CardView>
                    </View>  
                </DrawerLayout>
            )
        } else {
            return null
        }
    }       
}