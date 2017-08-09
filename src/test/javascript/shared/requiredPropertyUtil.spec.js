import chai from 'chai';
import {
    getRequiredPropertyNames,
    hasAllRequiredProperties
} from '../../../main/javascript/shared/requiredPropertyUtil';

describe('requiredPropertyUtil', function () {
    describe('getRequiredPropertyNames', function () {
        it('returns array of required property names', function () {

            const serviceBusinessInputFields = {
                "id": { label: "Service ID *", hint: "eg. \"ZOE\"", required: true },
                "label": { label: "Label *", hint: "eg. \"ZOE\"", required: true },
                "fdOwner": {
                    label: "Contact Person *",
                    hint: "eg. \"Altmann, Erik\"",
                    required: true,
                    searchEndpoint: "/selavi/person/search"
                },
                "tags": { label: "Tags", hint: "eg. \"dm-pos-belege, produktdaten\"", required: false },
                "description": {
                    label: "Description",
                    hint: "eg. \"ZKDB Online Echtzeitf\u00e4hig\"",
                    required: false,
                    multiLine: true
                },
            };

            const serviceTechInputFields = {
                "microserviceUrl": { label: "URL", hint: "eg. \"https://zoe.dm.de\"", required: false },
                "ipAddress": { label: "IP address(es)", hint: "eg. \"172.23.68.213\"", required: false },
                "networkZone": { label: "Network zone", hint: "eg. \"LAN\"", required: false },
                "external": { type: "toggle", label: "External service (eg., not a microservice)" }
            };

            const serviceDocumentationInputFields = {
                "documentationLink": {
                    label: "Link to documentation",
                    hint: "eg. \"https://wiki.dm.de/ZOE\"",
                    required: false,
                    isLink: true
                },
                "buildMonitorLink": {
                    label: "Link to Build Monitor",
                    hint: "eg. \"https://zoe-jenkins.dm.de\"",
                    required: false,
                    isLink: true
                },
                "monitoringLink": {
                    label: "Link to Monitoring",
                    hint: "eg. \"https://elk-kibana.dm.de\"",
                    required: false,
                    isLink: true
                },
                "bitbucketUrl": {
                    label: "Bitbucket URL",
                    hint: "eg. \"https://stash.dm.de/projects/ZOE/repos/zoe\"",
                    required: false,
                    isLink: true
                }
            };


            const serviceInputTabs = [
                { label: "Business", inputFields: serviceBusinessInputFields },
                { label: "Technical", inputFields: serviceTechInputFields },
                { label: "Documentation", inputFields: serviceDocumentationInputFields }
            ];

            const result = getRequiredPropertyNames(serviceInputTabs);

            chai.expect(result).to.deep.equal(["id", "label", "fdOwner"]);
        });
    });

    describe('hasAllRequiredProperties', function () {
        it('returns true if service has all required property', function () {

            const service = {
                "id": "selavi",
                "label": "selavi",
                "tag": "zoe",
                "consumes": [{ "target": "GLUECKSKIND-APP", "type": "REST" }],
                "fdOwner": "Erika Esteban Cardoso"
            };

            const requiredFields = ["id", "label", "fdOwner"];

            const result = hasAllRequiredProperties(service, requiredFields);

            chai.expect(result).to.be.true;
        });

        it('returns false if service is missing a required property', function () {

            const service = {
                "id": "selavi",
                "label": "selavi",
                "tag": "zoe",
                "consumes": [{ "target": "GLUECKSKIND-APP", "type": "REST" }],
                "fdOwner": "Erika Esteban Cardoso"
            };

            const requiredFields = ["id", "label", "fdOwner", "foo"];

            const result = hasAllRequiredProperties(service, requiredFields);

            chai.expect(result).to.be.false;
        });
    });
});