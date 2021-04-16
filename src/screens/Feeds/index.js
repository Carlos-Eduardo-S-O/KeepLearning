import React from 'react'
import { FlatList, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { Header } from 'react-native-elements'
import DrawerLayout from 'react-native-drawer-layout'

import staticFeeds from '../../assents/dictionaries/feed.json'
import FeedCard from '../../components/FeedCard'
import Menu from '../../components/Menu'
import LoginMenu from '../../components/LoginMenu'

import { 
    SpecialOnTheSameLine,
    SearchField,
    RightOnTheSameLine
} from '../../assents/style'

const FEEDS_PER_PAGE = 4

export default class Feeds extends React.Component {

    constructor (props){
        super(props)

        this.filterByWebsite = this.filterByWebsite.bind(this)

        this.state = {
            nextPage: 0,
            feeds: [],
            loading: false,
            isRefreshing: false,
            courseName: null,
            chosenWebsite: null
        }
    }

    loadFeeds = () =>{ 
        const { nextPage, feeds, courseName, chosenWebsite } = this.state

        this.setState({
            loading: true
        })
        
        if (courseName) {
            
            const moreFeeds = staticFeeds.feeds.filter((feed) => 
                feed.course.name.toLowerCase().includes(courseName.toLowerCase())
            )
            
            this.setState({
                feeds: moreFeeds,

                loading: false,
                isRefreshing: false
            })
        } else if (chosenWebsite) {
            const moreFeeds = staticFeeds.feeds.filter((feed) => 
            feed.site._id == chosenWebsite._id
            )
            
            this.setState({
                feeds: moreFeeds,

                loading: false,
                isRefreshing: false
            })
        }else{
            const initialId = nextPage * FEEDS_PER_PAGE + 1
            const finalId = initialId + FEEDS_PER_PAGE - 1
            const moreFeeds = staticFeeds.feeds. filter((feed) => feed._id >= initialId && feed._id <= finalId)

            if (moreFeeds.length) {
                console.log('Adding ' + moreFeeds.length + ' feeds')
                
                this.setState({
                    nextPage: nextPage + 1,
                    feeds: [...feeds, ...moreFeeds],
                    isRefreshing: false,
                    loading: false
                })
            } else {
                this.setState({
                    isRefreshing: false,
                    loading: false
                })
            }
        }
    }

    componentDidMount = () => {
        this.loadMoreFeeds()
    }

    loadMoreFeeds = () => {
        const { loading } = this.state

        if (loading){
            return
        }

        this.loadFeeds()
    }
    
    refresh = () => {
        this.setState({ isRefreshing: true, feeds: [], nextPage: 0, courseName: null, chosenWebsite: null}, 
            () => {
                this.loadFeeds()
            }
        )
    }

    showFeed = (feed) => {
        return(   
            <FeedCard feed={feed} navigator={this.props.navigation}/>
        )
    }

    updateCourseName = (name) => {
        this.setState({
            courseName: name.toLowerCase()
        })
    }

    showSearchBar = () => {
        const { courseName } = this.state

        return(
            <SpecialOnTheSameLine>
                <SearchField
                    onChangeText={
                        (keyword) => {
                            this.updateCourseName(keyword)
                            }
                        }
                    value={courseName}
                />
                <Icon style={{padding: 6}} size={28} name="search1"
                    onPress={
                        () => {
                            this.loadFeeds()
                        }
                    }
                />
            </SpecialOnTheSameLine>
        )
    }

    showMenu = () => {
        this.menu.openDrawer()
    }

    filterByWebsite = (website) => {
        
        this.setState({
            chosenWebsite: website
        },
        () => {
            this.loadFeeds()
        })

        this.menu.closeDrawer()
    }

    closeMenuLogin = () => {
        this.login.closeDrawer()
    }

    showFeeds = (feeds) => {
        const { isRefreshing } = this.state

        return(
            <DrawerLayout
                drawerWidth={250}
                drawerPosition={DrawerLayout.positions.Left}

                ref={drawerElement => {
                    this.menu = drawerElement
                }}

                renderNavigationView={() => <Menu filter={this.filterByWebsite} />}
            >
                <DrawerLayout
                    drawerWidth={250}
                    drawerPosition={DrawerLayout.positions.Right}

                    ref={drawerElement => {
                        this.login = drawerElement
                    }}

                    renderNavigationView={() => <LoginMenu close={this.closeMenuLogin} />}
                >
                    <Header backgroundColor={"#fff"} 
                        leftComponent={
                            <RightOnTheSameLine>
                                <Icon style={{}} size={28} name="menuunfold" 
                                    onPress={
                                        () => {
                                            this.showMenu()
                                        }
                                    }
                                />
                            </RightOnTheSameLine>
                            
                        }

                        centerComponent={
                            this.showSearchBar()
                        }

                        rightComponent={
                            <RightOnTheSameLine>
                                <Icon 
                                    name="user"
                                    size={28}
                                    style={{
                                        backgroundColor: "#efefef",
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "#999"
                                    }}
                                    onPress={
                                        () => {
                                            this.login.openDrawer()
                                        }
                                    }
                                />
                            </RightOnTheSameLine>
                        }
                    />
                    <FlatList
                        data={feeds}
                        numColumns={1}

                        onEndReached={() => this.loadMoreFeeds()}
                        onEndReachedThreshold={0.1}
                        
                        onRefresh={() => this.refresh()}
                        refreshing={isRefreshing}

                        keyExtractor={(item) => String(item._id)}
                        renderItem={({item}) => {
                            return(
                                <View style={{width: "100%"}}>
                                    {this.showFeed(item)}
                                </View>
                            )
                        }}
                    />
                </DrawerLayout>
            </DrawerLayout>
        )
    }
    
    render = () => {
        const { feeds } = this.state

        if (feeds.length) {
            console.log('Showing ' + feeds.length + ' feeds.')

            return(
                this.showFeeds(feeds) 
            )
        } else {
            return(
                null
            )
        }
    }
}