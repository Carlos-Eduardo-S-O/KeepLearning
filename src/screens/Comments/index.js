import React from 'react'
import { View, FlatList, Text, Modal, TextInput, Alert } from 'react-native'
import CardView from 'react-native-cardview'
import SyncStorage from 'sync-storage'
import { Header, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather'
import Swipeable from 'react-native-swipeable-row'
import Moment from 'react-moment'
import 'moment-timezone'
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
import { getComments, addComment, deleteComment } from '../../api'

const COMMENTS_PER_PAGE = 6

export default class Comments extends  React.Component {

    constructor(props) {
        super(props)

        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            comments: [],
            nextPage: 1,
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

        getComments(feedId, nextPage).then((moreComments) => {
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
        }).catch((error) => {
            console.error("Error displaying comments.", error)
        })
    }

    loadMoreComments = () => {
        const { loading } = this.state

        if (loading) {
            return
        } 

        this.loadComments()
    }

    refresh = () => {
        this.setState({ isRefreshing: true, loading: false, nextPage: 1, comments: []},
            () => {
                this.loadComments()
            }        
        )
    }

    addComment = () => {
        const { feedId, newComment } = this.state
        
        if(newComment == ""){ return }
        
        addComment(feedId, newComment).then(
            (result) => {
                if(result.situation === "ok") {
                    this.setState({
                        nextPage: 1,
                        comments: []
                    }, () =>{
                        this.loadComments()
                    })
                }
            }
        ).catch((error) => {
            console.error("Error adding comments", error)
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
                            maxLength={200}
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
        deleteComment(commentToRemove._id).then(
            (result) => {
                if (result.situation === "ok"){
                    this.setState({
                        nextPage: 1,
                        comments: []
                    }, () => {
                        this.loadComments()
                    })
                }
            }
        ).catch((error) => {
            console.error("Error removing comment: " + error)
        }) 
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
        console.log("I was here!")
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
                        if (item.user.email == user.account){
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