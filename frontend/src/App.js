import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const App = () => {
    const [usedPorts, setUsedPorts] = useState([]);
    const [pods, setPods] = useState([]);
    const [deployments, setDeployments] = useState([]);
    const [services, setServices] = useState([]);
    const [newPort, setNewPort] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [namespace, setNamespace] = useState('');
    const [message, setMessage] = useState('');

    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [cliInput, setCliInput] = useState('');
    const [cliOutput, setCliOutput] = useState([]);

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_BACKEND_IP}:5000/ports/used`)
            .then(response => response.json())
            .then(data => setUsedPorts(data));

        fetch(`http://${process.env.REACT_APP_BACKEND_IP}:5000/k8s/pods`)
            .then(response => response.json())
            .then(data => setPods(data));

        fetch(`http://${process.env.REACT_APP_BACKEND_IP}:5000/k8s/deployments`)
            .then(response => response.json())
            .then(data => setDeployments(data));

        fetch(`http://${process.env.REACT_APP_BACKEND_IP}:5000/k8s/services`)
            .then(response => response.json())
            .then(data => setServices(data));
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

    const handleChatSubmit = (e) => {
        e.preventDefault();
        // Simulate AI response
        const aiResponse = `AI: You said "${chatInput}"`;
        setChatMessages([...chatMessages, `You: ${chatInput}`, aiResponse]);
        setChatInput('');
    };

    const handleCliSubmit = (e) => {
        e.preventDefault();
        // Simulate CLI command execution
        let output;
        switch(cliInput) {
            case 'status':
                output = 'CLI: System is running.';
                break;
            case 'pods':
                output = `CLI: Pods running: ${pods.length}`;
                break;
            default:
                output = `CLI: Unknown command "${cliInput}"`;
        }
        setCliOutput([...cliOutput, `> ${cliInput}`, output]);
        setCliInput('');
    };

    const podChartData = {
        labels: pods.map(pod => `${pod.name} (${pod.namespace})`),
        datasets: [{
            label: 'Pods',
            data: pods.map(pod => pod.status === 'Running' ? 1 : 0),
            backgroundColor: pods.map(pod => pod.status === 'Running' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const deploymentChartData = {
        labels: deployments.map(dep => `${dep.name} (${dep.namespace})`),
        datasets: [{
            label: 'Deployments',
            data: deployments.map(dep => dep.replicas),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const serviceChartData = {
        labels: services.map(svc => `${svc.name} (${svc.namespace})`),
        datasets: [{
            label: 'Services',
            data: services.map(svc => svc.ports.length),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }]
    };

    return (
        <div>
            <h1>Port Manager</h1>
            <h2>Used Ports</h2>
            <Bar data={podChartData} />
            <h2>Kubernetes Pods</h2>
            <Bar data={podChartData} />
            <h2>Kubernetes Deployments</h2>
            <Bar data={deploymentChartData} />
            <h2>Kubernetes Services</h2>
            <Bar data={serviceChartData} />
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

            <h2>AI Chat</h2>
            <div>
                <form onSubmit={handleChatSubmit}>
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your message"
                    />
                    <button type="submit">Send</button>
                </form>
                <div>
                    {chatMessages.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
            </div>

            <h2>CLI</h2>
            <div>
                <form onSubmit={handleCliSubmit}>
                    <input
                        type="text"
                        value={cliInput}
                        onChange={(e) => setCliInput(e.target.value)}
                        placeholder="Type your command"
                    />
                    <button type="submit">Execute</button>
                </form>
                <div>
                    {cliOutput.map((output, index) => (
                        <p key={index}>{output}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;


