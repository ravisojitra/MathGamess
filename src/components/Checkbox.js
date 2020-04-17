import React from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class Checkbox extends React.Component {

    constructor(props) {
        super(props);
        console.log("props => ",props)
        this.state = {
            isChecked: props.isChecked
        }
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    color: '#2F80ED',
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 14,
                    alignItems: 'flex-start',
                }}
                onPress={() => { 
                    this.setState({ isChecked: !this.state.isChecked }, () => { 
                        this.props.onPress(this.state.isChecked) 
                    }) 
                }}
            >
                <Feather
                    name={!this.state.isChecked ? 'square' : 'check-square'}
                    size={this.props.size || 25}
                    color={this.props.color || 'white'}
                />

            </TouchableOpacity>
        )
    }
}
