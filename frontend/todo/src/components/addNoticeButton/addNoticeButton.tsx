import React from 'react';
import './addNoticeButton.css';
import { postNotice } from '../../services/infoRequests';
import { Notice } from '../../interfaces/requests';
import Popup from 'reactjs-popup';
import {FocusEvent} from 'react'
import TimePicker from '../timepicker/timepicker';

interface Props {
    token: string,
    returnToLogin: any,
    selectedDate: Date
}

interface State {
    notice: Notice
    headerSelected: boolean
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
                color: "",
                description: ""
            },
            headerSelected: false
        }
    }

    render() {
        const { renderTitle, dateToStringFormat, renderStartDate, renderEndDate, renderDescription,
             inputFocus, inputBlur } = this;
        const { headerSelected} = this.state;
        const { title, beginDate, endDate, description } = this.state.notice;
        let beginDateFormatted = dateToStringFormat(beginDate)
        let endDateFormatted = dateToStringFormat(endDate)

        return(
            <div>
                <Popup trigger={<button>Create Event</button>} modal position="top center">
                    <div className="popup-content">
                        <div className="popup-item popup-header">
                            <input onFocus={e => inputFocus(e)} onBlur={e => inputBlur(e)} autoComplete="off" className="popup-title-input" 
                            type="text" value={title} placeholder="Event Title" onChange={e => renderTitle(e)} tabIndex={0}></input>
                            <div className={`popup-header-underline ${headerSelected ? "popup-header-highlight" : ""}`}></div>
                        </div>
                        <div className="popup-item" id="container-popup-dates">
                            <div className="container-popup-date">
                                <input className="popup-date" required={true} onChange={e => renderStartDate(e)} value={beginDateFormatted} type="date"></input>
                                <TimePicker />
                            </div>
                            <span className="popup-date-hyphen">-</span>
                            <div className="container-popup-date">
                                <input className="popup-date" required={true} onChange={e => renderEndDate(e)} 
                                min={beginDateFormatted} value={endDateFormatted} type="date"></input>
                                <TimePicker />
                            </div>
                        </div>
                        <div className="popup-item">
                            <textarea placeholder="Event Notes" value={description} onChange={e => renderDescription(e)}></textarea>
                        </div>
                        <button>Create Event</button>
                    </div>
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
        let month =  date.getMonth().toString();
        if(parseInt(month) < 10) month = `0${month}`;
        let form = date.getFullYear() + '-' + month + '-' + day;
        return form
    }

    //Date Objects are pass by reference so adjusting teh date parameter will directly change the associated object out of function scope
    updateDateWithStringFormat = (date: Date, stringDate: string) => {
        let arr = stringDate.split('-');
        date.setDate(parseInt(arr[2]))
        date.setMonth(parseInt(arr[1]))
        date.setFullYear(parseInt(arr[0]))
    }

    inputBlur = (event: FocusEvent<HTMLInputElement>) => {
        this.setState({
            headerSelected: false
        })
    }

    inputFocus = (event: FocusEvent<HTMLInputElement>) => {
        this.setState({
            headerSelected: true
        })
    }

    addNotice = () => {
        postNotice(this.props.token, this.state.notice)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err)
            })
    }

}

export default AddNoticeButton;