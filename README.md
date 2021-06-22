# FFC Grants File Creation

FFC Grants file creation microservice.

## Prerequisites

- Access to an instance of an
[Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/).
- Access to an instance of an
[Azure Storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview).
- Docker
- Docker Compose

### Azure Service Bus

This service depends on a valid Azure Service Bus connection string for
asynchronous communication.  The following environment variables need to be set
in any non-production environment before the Docker container is started or tests
are run.

When deployed into an appropriately configured AKS
cluster (where [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) is
configured) the microservice will use AAD Pod Identity through the manifests
for
[azure-identity](./helm/ffc-grants-file-creation/templates/azure-identity.yaml)
and
[azure-identity-binding](./helm/ffc-grants-file-creation/templates/azure-identity-binding.yaml).

| Name | Description |
| ---| --- |
| SERVICE_BUS_HOST | Azure Service Bus hostname, e.g. `myservicebus.servicebus.windows.net` |
| SERVICE_BUS_PASSWORD | Azure Service Bus SAS policy key |
| SERVICE_BUS_USER     | Azure Service Bus SAS policy name, e.g. `RootManageSharedAccessKey` |
| DESIRABILITY_SUBMITTED_TOPIC_ADDRESS |  |
| DESIRABILITY_SUBMITTED_SUBSCRIPTION_ADDRESS |  |
| FILE_CREATED_TOPIC_ADDRESS |  |

### Environment variables

The following environment variables are required by the application container.
Values for development are set in the Docker Compose configuration. Default
values for production-like deployments are set in the Helm chart and may be
overridden by build and release pipelines.

| Name | Description |
| --- | --- |
| BLOB_STORAGE_CONNECTION_STRING | Connection string to Azure storage container |
| BLOB_STORAGE_CONTAINER_NAME | Blob storage container in Azure storage account |

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

The Docker image can be built through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start

Use Docker Compose to run service locally.

* start
  * `docker-compose up`
* stop
  * `docker-compose down` or CTRL-C

## Test structure

The tests have been structured into subfolders of `./test` as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

### Running tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
