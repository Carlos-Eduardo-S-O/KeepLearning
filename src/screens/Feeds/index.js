import React from 'react'
import { FlatList, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { Header } from 'react-native-elements'
import DrawerLayout from 'react-native-drawer-layout'

import FeedCard from '../../components/FeedCard'
import Menu from '../../components/Menu'
import LoginMenu from '../../components/LoginMenu'
import { getFeeds, getFeedsPerName, getFeedsPerWebsite } from '../../api'

import { 
    SpecialOnTheSameLine,
    SearchField,
    RightOnTheSameLine
} from '../../assets/style'

export default class Feeds extends React.Component {

    constructor (props){
        super(props)

        this.filterByWebsite = this.filterByWebsite.bind(this)

        this.state = {
            nextPage: 1,
            feeds: [],
            loading: false,
            isRefreshing: false,
            courseName: null,
            chosenWebsite: null
        }
    }

    auxiliaryToLoadFeeds = (moreFeeds) => {
        const { nextPage, feeds } = this.state
        console.log("here")
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

    loadFeeds = () =>{ 
        const { nextPage, courseName, chosenWebsite } = this.state

        this.setState({
            loading: true
        })
        
        if (chosenWebsite) {
            getFeedsPerWebsite(chosenWebsite._id, nextPage).then((moreFeeds) => {
                this.auxiliaryToLoadFeeds(moreFeeds)
            }).catch((error) => {
                console.log("Error to loading feeds: ", error)
            })
        } else if (courseName) {
            getFeedsPerName(courseName, nextPage).then((moreFeeds) => {
                this.auxiliaryToLoadFeeds(moreFeeds)
            }).catch((error) => {
                console.error("Error accessing feeds: ", error)
            })
        }else{
            getFeeds(nextPage).then((moreFeeds) =>{
                this.auxiliaryToLoadFeeds(moreFeeds)
            }).catch((error) => {
                console.error("error accessing feeds: ", error)
            })
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
        this.setState({ isRefreshing: true, feeds: [], nextPage: 1, courseName: null, chosenWebsite: null}, 
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
                            this.setState({
                                nextPage: 1,
                                feeds: []
                            }, 
                                () => {
                                    this.loadFeeds()
                                }
                            )
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
            chosenWebsite: website,
            nextPage: 1,
            feeds: []
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