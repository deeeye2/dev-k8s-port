from flask import Flask, jsonify, request
from kubernetes import client, config

app = Flask(__name__)

# Load Kubernetes configuration
config.load_kube_config()

v1 = client.CoreV1Api()
apps_v1 = client.AppsV1Api()

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

@app.route('/k8s/resources', methods=['GET'])
def k8s_resources():
    resources = {
        "pods": len(v1.list_pod_for_all_namespaces().items),
        "services": len(v1.list_service_for_all_namespaces().items),
        "deployments": len(apps_v1.list_deployment_for_all_namespaces().items),
        "statefulsets": len(apps_v1.list_stateful_set_for_all_namespaces().items),
        "daemonsets": len(apps_v1.list_daemon_set_for_all_namespaces().items),
        "nodes": len(v1.list_node().items),
        "replicasets": len(apps_v1.list_replica_set_for_all_namespaces().items),
        "jobs": len(client.BatchV1Api().list_job_for_all_namespaces().items),
        "cronjobs": len(client.BatchV1beta1Api().list_cron_job_for_all_namespaces().items)
    }
    return jsonify(resources)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

