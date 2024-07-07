import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const App = () => {
    const [usedPorts, setUsedPorts] = useState([]);
    const [newPort, setNewPort] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [namespace, setNamespace] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://<BACKEND_IP>:5000/ports/used')  // Replace <BACKEND_IP> with your backend's IP address
            .then(response => response.json())
            .then(data => setUsedPorts(data));
    }, []);

    const openPort = () => {
        fetch('http://<BACKEND_IP>:5000/ports/open', {  // Replace <BACKEND_IP> with your backend's IP address
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ port: newPort, service_name: serviceName, namespace: namespace }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setMessage(data.message);
                    setUsedPorts([...usedPorts, { port: parseInt(newPort), service: serviceName, namespace: namespace }]);
                } else {
                    setMessage(data.error);
                }
            });
    };

    const chartData = {
        labels: usedPorts.map(port => `${port.service}:${port.port}`),
        datasets: [{
            label: 'Ports',
            data: usedPorts.map(port => port.port),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    return (
        <div>
            <h1>Port Manager</h1>
            <h2>Used Ports</h2>
            <Bar data={chartData} />
            <h2>Open a New Port</h2>
            <input
                type="number"
                value={newPort}
                onChange={(e) => setNewPort(e.target.value)}
                placeholder="Port Number"
            />
            <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Service Name"
            />
            <input
                type="text"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="Namespace"
            />
            <button onClick={openPort}>Open Port</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default App;
