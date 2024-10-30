import {bin} from 'd3-array';
import {useEffect, useState} from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {Col, Radio, Row, Statistic} from 'antd';
import _ from "lodash";


const ValenceArousalHistogram = ({data}) => {

    const [histData, setHistData] = useState([]);
    const [histDisplay, setHistDisplay] = useState("valence");
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setHistDisplay(e.target.value);
    };
    console.log(data)

    useEffect(() => {
        if (!data)
            return;
        // Create bins with D3's bin function
        setHistData([]);
        const binner = bin().thresholds(100); // Define 10 bins
        const binnedData = binner(data[histDisplay]);

        console.log(binnedData)

        for (let i = 0; i < binnedData.length; i++) {
            console.log(binnedData[i])
        }
        setHistData(
            binnedData.map(
                (d) => (
                    {
                        value: d.x0 + (d.x1 - d.x0) / 2,
                        // value: `${d.x0} to ${d.x1}`,
                        count: d.length
                    }
                )
            )
        )
    }, [data, histDisplay]);

    return (
        <div>
            <Radio.Group onChange={onChange} value={histDisplay}>
                <Radio value="valence">Valence</Radio>
                <Radio value="arousal">Arousal</Radio>
            </Radio.Group>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={histData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="value"
                           label={{value: histDisplay, dy: 15}}/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="count" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>
            {data && <Statistic title="Mean:" value={(_.mean(data[histDisplay]))}/>}

        </div>
    )
}

export default ValenceArousalHistogram;