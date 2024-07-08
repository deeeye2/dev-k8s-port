import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const App = () => {
    const [usedPorts, setUsedPorts] = useState([]);
    const [newPort, setNewPort] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [namespace, setNamespace] = useState('');
    const [message, setMessage] = useState('');
    const [k8sResources, setK8sResources] = useState({});

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_BACKEND_IP}:5000/ports/used`)
            .then(response => response.json())
            .then(data => setUsedPorts(data));
    }, []);

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_BACKEND_IP}:5000/k8s/resources`)
            .then(response => response.json())
            .then(data => setK8sResources(data));
    }, []);

    const openPort = () => {
        fetch(`http://${process.env.REACT_APP_BACKEND_IP}:5000/ports/open`, {
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

    const portChartData = {
        labels: usedPorts.map(port => `${port.service}:${port.port}`),
        datasets: [{
            label: 'Ports',
            data: usedPorts.map(port => port.port),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const k8sChartData = {
        labels: Object.keys(k8sResources),
        datasets: [{
            label: 'K8s Resources',
            data: Object.values(k8sResources),
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 205, 86, 0.6)',
                'rgba(54, 162, 235, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    };

    return (
        <div>
            <h1>Port Manager</h1>
            <h2>Used Ports</h2>
            <Bar data={portChartData} />
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
            <h2>Kubernetes Resources</h2>
            <Doughnut data={k8sChartData} />
        </div>
    );
};

export default App;


