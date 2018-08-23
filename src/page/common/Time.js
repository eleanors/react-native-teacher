// TabView.js

'use strict';

import React, {Component} from 'react';

export default class Time extends Component {

    static createDateData(){
        let date = [];
        for (let i = 1970; i < 2018; i++) {
            let month = [];
            for (let j = 1; j < 13; j++) {
                let day = [];
                if (j === 2) {
                    for (let k = 1; k < 29; k++) {
                        day.push(k + '日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if (i % 4 === 0) {
                        day.push(29 + '日');
                    }
                }
                else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
                    for (let k = 1; k < 32; k++) {
                        day.push(k + '日');
                    }
                }
                else {
                    for (let k = 1; k < 31; k++) {
                        day.push(k + '日');
                    }
                }
                let _month = {};
                _month[j + '月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i + '年'] = month;
            date.push(_date);
        }
        return date;
    }

    static createTimeData() {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for(let i=2018;i<=2019;i++){
            years.push(i+'年');
        }
        for(let i=1;i<13;i++){
            months.push(i+'月');
        }
        for(let i=1;i<32;i++){
            days.push(i+'日');
        }
        for(let i=0;i<24;i++){
            hours.push(i+'时');
        }
        for(let i=0;i<60;i++){
            minutes.push(i+'分');
        }
        let pickerData = [years, months, days, hours, minutes];
        return pickerData;
    }

}
