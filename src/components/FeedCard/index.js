import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Card, CardContent, CardImage } from 'react-native-cards'
import {
    Avatar,
    Title,
    Description,
    OnTheSameLine
} from '../../assets/style'
import { getImage } from '../../api/'

export default class FeedCard extends React.Component {
    
    constructor (props) {
        super(props)

        this.state = {
            feed: this.props.feed,
            navigator: this.props.navigator
        }
    }

    render = () => {
        const { feed, navigator } = this.state
        return (
            <TouchableOpacity onPress={
                () => {
                    navigator.navigate("Details", {feedId: feed._id, navigator: navigator})
                }
            }>
                <Card>
                    <CardImage source={getImage(feed.course.blobs[0].file)}/>
                    <CardContent>
                    <OnTheSameLine>
                        <Avatar source={getImage(feed.site.avatar)}/>
                        <Title>{feed.site.name}</Title>
                    </OnTheSameLine>
                    </CardContent>
                    <CardContent>
                        <Title>{feed.course.name}</Title>
                    </CardContent>
                    <CardContent>
                        <Description>{feed.course.description}</Description>
                    </CardContent>
                    
                </Card>
            </TouchableOpacity>
        )
    }
}