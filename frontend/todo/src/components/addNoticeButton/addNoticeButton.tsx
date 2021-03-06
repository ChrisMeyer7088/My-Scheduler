import React from 'react';
import './addNoticeButton.css';
import { postNotice } from '../../services/infoRequests';
import { Notice } from '../../interfaces/requests';
import Popup from 'reactjs-popup';
import TimePicker from '../timepicker/timepicker';
import ColorWheel from '../colorWheel/colorWheel';

interface Props {
    token: string,
    returnToLogin: any,
    selectedDate: Date
}

interface State {
    notice: Notice
    errorHeader: boolean
}

class AddNoticeButton extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        let beginDate = this.props.selectedDate;
        let endDate = new Date(this.props.selectedDate.getTime());
        endDate.setMinutes(endDate.getMinutes() + 30);

        this.state = {
            notice: {
                title: "",
                beginDate,
                endDate,
                color: "#00aaff",
                description: ""
            },
            errorHeader: false
        }
    }

    render() {
        const { renderTitle, dateToStringFormat, renderStartDate, renderEndDate, renderDescription, 
            updateBeginDate, updateEndDate, updateColor, requestCreateNotice } = this;
        const {notice, errorHeader} = this.state;
        const { title, beginDate, endDate, description, color } = notice;
        let beginDateFormatted = dateToStringFormat(beginDate)
        let endDateFormatted = dateToStringFormat(endDate);

        let headerClass = "popup-title-input"
        if(errorHeader) headerClass += " error-border"

        return(
            <div>
                <Popup trigger={<button className="container-addNotice button-movingShadow">
                                    <div className="container-addNotice-text">Create Event</div>
                                </button>} modal position="top center" repositionOnResize >

                    {close => <div className="popup-content">
                        <div className="popup-item popup-header">
                            <input autoComplete="off" className={headerClass} type="text" 
                            value={title} placeholder="Event Title" onChange={e => renderTitle(e)} tabIndex={0}></input>
                        </div>
                        <div className="popup-item" id="container-popup-dates">
                            <div className="container-popup-date">
                                <input className="popup-date" required={true} onChange={e => renderStartDate(e)} value={beginDateFormatted} type="date"></input>
                                <TimePicker startDate={beginDate} updateEndDate={updateEndDate} 
                                updateBeginDate={updateBeginDate} />
                            </div>
                            <span className="popup-date-hyphen">-</span>
                            <div className="container-popup-date">
                                <input className="popup-date" required={true} onChange={e => renderEndDate(e)} 
                                min={beginDateFormatted} value={endDateFormatted} type="date"></input>
                                <TimePicker updateBeginDate={updateBeginDate} updateEndDate={updateEndDate} 
                                startDate={beginDate} endDate={endDate}/>
                            </div>
                        </div>
                        <div>
                            <ColorWheel color={color} onChange={updateColor} />
                        </div>
                        <div className="popup-item">
                            <textarea className="popup-details" placeholder="Event Notes" value={description} onChange={e => renderDescription(e)}></textarea>
                        </div>
                        <div className="popup-item container-popup-createEvent">
                            <button onClick={() => {
                                requestCreateNotice(close);
                                }} className="popup-createEvent button-movingShadow">Create</button>                            
                        </div>
                    </div>}
                </Popup>
            </div>
        )
    }

    renderTitle = (event: any) => {
        let notice = this.state.notice;
        notice.title = event.target.value;
        this.setState({
            notice
        })
    }

    renderStartDate = (event: any) => {
        const { updateDateWithStringFormat } = this;
        const { beginDate, endDate } = this.state.notice;

        updateDateWithStringFormat(beginDate, event.target.value);

        //Automaticall update endDate if beginDate passes it
        if(beginDate.getTime() > endDate.getTime()) endDate.setTime(beginDate.getTime());
        
        //Date Object pass by reference so already updated in state at this point
        this.setState({})
    }

    renderEndDate = (event: any) => {
        const { updateDateWithStringFormat } = this;
        const { endDate } = this.state.notice;

        updateDateWithStringFormat(endDate, event.target.value);
        
        //Date Object pass by reference so already updated in state at this point
        this.setState({})
    }

    updateColor = (color: any) => {
        if(color.hex) {
            let notice = this.state.notice;
            notice.color = color.hex;
            this.setState({
                notice
            })
        }
    }

    renderDescription = (event: any) => {
        let notice = this.state.notice;
        notice.description = event.target.value;
        this.setState({
            notice
        })
    }
    
    dateToStringFormat = (date: Date) => {
        let day =  date.getDate().toString();
        if(parseInt(day) < 10) day = `0${day}`;
        let month =  (date.getMonth() + 1).toString();
        if(parseInt(month) < 10) month = `0${month}`;
        let form = date.getFullYear() + '-' + month + '-' + day;
        return form;
    }

    //Date Objects are pass by reference so adjusting teh date parameter will directly change the associated object out of function scope
    updateDateWithStringFormat = (date: Date, stringDate: string) => {
        let arr = stringDate.split('-');
        date.setDate(parseInt(arr[2]))
        date.setMonth(parseInt(arr[1]))
        date.setFullYear(parseInt(arr[0]))
    }

    updateBeginDate = (newBeginDate: Date) => {
        let currentNotice = this.state.notice;
        currentNotice.beginDate = newBeginDate;
        this.setState({
            notice: currentNotice
        })
    }

    updateEndDate = (newEndDate: Date) => {
        let currentNotice = this.state.notice;
        currentNotice.endDate = newEndDate;
        this.setState({
            notice: currentNotice
        })
    }

    requestCreateNotice = (close: any) => {
        const { token, returnToLogin} = this.props;
        const { notice } = this.state;
        if(!notice.title) {
            this.setState({
                errorHeader: true
            })
        } else {
            postNotice(token, this.state.notice)
            .then(res => {
                close();
            })
            .catch(err => {
                if(err.response.status === 401) {
                    returnToLogin();
                }
            })
            this.setState({
                errorHeader: false
            })
        }       
    }
}

export default AddNoticeButton;