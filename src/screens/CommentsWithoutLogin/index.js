import React from 'react'
import { View, FlatList, Text } from 'react-native'
import CardView from 'react-native-cardview'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather'
import Moment from 'react-moment'
import 'moment-timezone'

import staticComments from '../../assets/dictionaries/comments.json'
import {
    Title,
    Description,
    RightOnTheSameLine,
    Container,
    OnTheSameLine,
} from '../../assets/style'

const COMMENTS_PER_PAGE = 6

export default class CommentsWithoutLogin extends  React.Component {

    constructor(props) {
        super(props)

        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            comments: [],
            nextPage: 0,
            newComment: "",

            isRefreshing: false,
            loading: false
        }
    }

    componentDidMount = () => {
        this.loadComments()
    }

    loadComments = () => {
        const { feedId, comments, nextPage } = this.state

        this.setState({
            loading: true
        })

        const initialId = nextPage * COMMENTS_PER_PAGE + 1
        const finalId = initialId + COMMENTS_PER_PAGE -1

        const moreComments = staticComments.comments.filter(
            (comment) => comment._id >= initialId && comment._id <= finalId && comment.course_id === feedId
        )

        if (moreComments.length) {
            this.setState({
                nextPage: nextPage + 1,
                comments: [...comments, ...moreComments],

                loading: false,
                isRefreshing: false
            })
        } else {
            this.setState({
                loading: false,
                isRefreshing: false
            })
        }
        
    }

    loadMoreComments = () => {
        const { loading } = this.state

        if (loading) {
            return
        } 

        this.loadComments()
    }

    refresh = () => {
        this.setState({ isRefreshing: true, loading: false, nextPage: 0, comments: []},
            () => {
                this.loadComments()
            }        
        )
    }

    showComment = (comment) =>{
        return(
            <CardView style={{marginBottom: 2}}>
                <Container>
                    <Title>{comment.user.name+": "}</Title>
                </Container>
                    
                <Container >
                    <Description>{comment.comment}</Description> 
                </Container>
                <Container>
                    <OnTheSameLine>
                        <Moment
                            element={Text}
                            parse="YYYY-MM-DD HH:mm"
                            format="DD/MM/YYYY HH:mm"
                        >
                            {comment.datetime}
                        </Moment>
                    </OnTheSameLine>
                </Container>
                <Container/>
            </CardView>
        )
    }

    showHeader = () => {

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
                        <Title style={{fontSize: 18}}>Comentários</Title>
                    </RightOnTheSameLine>      
                }

                rightComponent={
                    null
                }
            />
        )
    }

    showComments = () => {
        const { comments, isRefreshing } = this.state
        
        return(
            <FlatList
                data={comments}

                onEndReached={() => this.loadMoreComments()}
                onEndReachedThreshold={0.1}

                onRefresh={()=> this.refresh()}
                refreshing={isRefreshing}

                keyExtractor={(item) => String(item._id)}
                renderItem = {
                    ({item}) => {
                        return this.showComment(item)
                    }
                }
            />
        )
    }

    render = () => {
        const { comments } = this.state

        if (comments) {
            return(
                <View>
                    {this.showHeader()}
                    {this.showComments()}
                </View>
            )
        } else {
            return null
        }
    }
}