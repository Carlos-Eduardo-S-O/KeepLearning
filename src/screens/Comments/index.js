import React from 'react'
import { View, FlatList, Text, Modal, TextInput, Alert } from 'react-native'
import CardView from 'react-native-cardview'
import SyncStorage from 'sync-storage'
import { Header, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather'
import Swipeable from 'react-native-swipeable-row'
import Moment from 'react-moment'
import 'moment-timezone'

import staticComments from '../../assets/dictionaries/comments.json'
import {
    Title,
    Description,
    RightOnTheSameLine,
    Container,
    OnTheSameLine,
    AddCommentContainer,
    CenterAddComment,
    ButtonAddComment,
    InputAddComment,
    ModalButtonCommentContainerView,
    CenterModalButtoonView
} from '../../assets/style'

const COMMENTS_PER_PAGE = 6
const MAXIMUM_SIZE_OF_COMMENT = 200

export default class Comments extends  React.Component {

    constructor(props) {
        super(props)

        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            comments: [],
            nextPage: 0,
            newComment: "",

            isRefreshing: false,
            loading: false,
            visibilityOfTheAdditionScreen: false
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

    addComment = () => {
        const { feedId, comments, newComment } = this.state
        const user = SyncStorage.get("user")
        
        if(newComment == ""){ return }
        
        var comment = [
            {
                "_id": comments.length + 100,
                "course_id": feedId,
                "user": {
                    "userId": 2,
                    "email": user.email,
                    "name": user.name
                },
                "datetime": "2021-03-21T12:00-0500",
                "comment": newComment
            }
        ]

        this.setState ({
            comments: [...comment, ...comments],
            newComment: ""
        })

        this.changeTheVisibilityOfTheAdditionScreen()
        
    }

    changeTheVisibilityOfTheAdditionScreen = () => {
        const {visibilityOfTheAdditionScreen} = this.state
        
        this.setState({ visibilityOfTheAdditionScreen : !visibilityOfTheAdditionScreen})
    }

    updateTextNewComment = (text) => {
        this.setState({
            newComment: text
        })
    }

    showAddCommentScreen = () => {
        return(
        
            <Modal
                animationType="slide"
                transparent={true}

                onRequestClose={this.refresh}
            >
                <AddCommentContainer>
                    <InputAddComment>
                        <TextInput
                            multiline
                            editable
                            placeholder={"Digite o seu comentário."}
                            maxLength={MAXIMUM_SIZE_OF_COMMENT}
                            onChangeText={this.updateTextNewComment}
                        />
                    </InputAddComment>
                    <CenterAddComment>
                        <ButtonAddComment>
                            <Button
                                icon={
                                    <Icon 
                                        name="check"
                                        size={22}
                                        color="#fff"
                                    />
                                }

                                title="Salvar"
                                type="solid"
                                onPress={this.addComment}
                            />
                        </ButtonAddComment>
                        <ButtonAddComment>
                            <Button
                                icon={
                                    <Icon
                                        name="x"
                                        size={22}
                                        color="#fff"
                                    />
                                }
                                title="Cancelar"
                                type="solid"

                                onPress={this.changeTheVisibilityOfTheAdditionScreen}
                            />
                        </ButtonAddComment>
                    </CenterAddComment>
                </AddCommentContainer>
            </Modal>  
        )
    }

    removeComment = (commentToRemove) => {
        const { comments } = this.state
        
        const filteredComments = comments.filter(comment => comment._id !== commentToRemove._id)

        this.setState({
            comments: filteredComments
        },
            () => {
                this.refresh()
            }
        )
    }

    confirmRemoval = (comment) => {
        Alert.alert(
            null,
            "Deseja remover o seu comentário?",
            [
                {text: "Não", style: 'cancel'},
                {text: "Sim", onPress: () => this.removeComment(comment)}
            ]
        )
    }

    showUserComment = (comment) =>{
        return(
            <Swipeable
                rightButtonWidth={50}
                rightButtons={
                    [
                        <ModalButtonCommentContainerView>
                            <CenterModalButtoonView>
                                <Icon 
                                    name="trash"
                                    color="#fff"
                                    size={28}
                                    onPress={
                                        () => {
                                            this.confirmRemoval(comment)
                                        }
                                    }
                                />
                            </CenterModalButtoonView>
                        </ModalButtonCommentContainerView>
                    ]
                }
            >
                <CardView style={{marginBottom: 2}}>
                    <Container>
                        <Title>Você: </Title>
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
            </Swipeable>
        )
    }

    showOtherPeopleComment = (comment) =>{
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
                    <RightOnTheSameLine>
                        <Icon 
                            size={28}
                            name="plus"
                            onPress={
                                () => {
                                    this.changeTheVisibilityOfTheAdditionScreen()
                                }
                            }
                        />
                    </RightOnTheSameLine>
                }
            />
        )
    }

    showComments = () => {
        const { comments, isRefreshing } = this.state
        const user = SyncStorage.get("user")
        
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
                        if (item.user.email == user.email){
                            return this.showUserComment(item)
                        } else {
                            return this.showOtherPeopleComment(item)
                        }
                    }
                }
            />
        )
    }

    render = () => {
        const { comments, visibilityOfTheAdditionScreen } = this.state

        if (comments) {
            return(
                <View>
                    {this.showHeader()}
                    {this.showComments()}
                    {visibilityOfTheAdditionScreen && this.showAddCommentScreen()}
                </View>
            )
        } else {
            return null
        }
    }
}