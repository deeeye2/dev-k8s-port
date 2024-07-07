from flask import Flask, jsonify, request
from kubernetes import client, config

app = Flask(__name__)

# Load Kubernetes configuration
config.load_kube_config()

v1 = client.CoreV1Api()

@app.route('/ports/used', methods=['GET'])
def used_ports():
    services = v1.list_service_for_all_namespaces()
    ports = []
    for service in services.items:
        for port in service.spec.ports:
            ports.append({"port": port.port, "service": service.metadata.name, "namespace": service.metadata.namespace})
    return jsonify(ports)

@app.route('/ports/open', methods=['POST'])
def open_new_port():
    data = request.get_json()
    port = data.get('port')
    service_name = data.get('service_name')
    namespace = data.get('namespace')

    service = v1.read_namespaced_service(name=service_name, namespace=namespace)
    new_port = client.V1ServicePort(port=port, target_port=port)
    service.spec.ports.append(new_port)
    v1.patch_namespaced_service(name=service_name, namespace=namespace, body=service)

    return jsonify({"message": "Port opened successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
