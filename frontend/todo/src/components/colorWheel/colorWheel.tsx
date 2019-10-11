import React from 'react';
import './colorWheel.css';
import { SketchPicker } from 'react-color';

interface Props {
    onChange: any;
    initalColor: string;
}

interface State {
    color: string
    showWheel: boolean;
}

class ColorWheel extends React.Component<Props, State> {
    private colorWheelRef = React.createRef<HTMLDivElement>();
    constructor(props: any) {
        super(props);

        this.state = {
            color: this.props.initalColor || '#00aaff',
            showWheel: false,
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    render() {
        const { toggleColorPicker, handleChange } = this;
        const { showWheel, color } = this.state;

        let colorWheelStyle = {backgroundColor: color}

        return (
            <div className="container-colorWheel">
                <button onClick={() => toggleColorPicker(true)} className="colorWheel-trigger" style={colorWheelStyle}></button>
                <div className="popup-colorSelector" ref={this.colorWheelRef} hidden={!showWheel}>
                    <SketchPicker color={color} onChange={handleChange} />
                </div>
            </div>
        )
    }

    handleChange = (color: any) => {
        if(color && color.hex) {
            this.setState({
                color: color.hex
            })
        }
    }

    handleClickOutside = (event: any) => {
        let node = this.colorWheelRef.current;
        if(node && !node.contains(event.target)) {
            this.toggleColorPicker(false);
        }
    }

    toggleColorPicker = (bool: boolean) => {
        this.setState({
            showWheel: bool
        })
    }
}

export default ColorWheel;