const { default: axios } = require("axios");
const {
    createToyotaObj,
    createVolkswagenObj
} = require("./makeProspectObject");
const forEach = require("lodash/forEach");
const { ENV, TOYOTA_OPTIONS, TOYOTA_ERRORS } = require("./constants");

const sendToyotaLead = async (leadObj, dealer) => {
    const {
        prospect: {
            customer: { contacts }
        }
    } = leadObj;

    const name = contacts[0].names[0].value;
    const lastname = contacts[0].names[1].value;

    const config = TOYOTA_OPTIONS(dealer);
    try {
        const res = await axios.post(
            ENV.XAPPIA_API_TOYOTA,
            JSON.stringify(leadObj),
            config
        );
        const { status, data } = res;
        const { LeadId: leadId } = data;
        const ok = status === 200;

        if (ok) return { leadId, name, lastname };
    } catch (err) {
        console.log("==========ERROR LOGS==========");
        console.log("==============================");
        console.log(err);
        console.log(err.response.data);
        console.log("==============================");

        const errorMessage = TOYOTA_ERRORS(err.response.data);

        if (err.response.data) throw new Error(errorMessage);
    }
};

const sendVolkswagenLead = async prospectObj => {
    try {
        const res = await axios.post(ENV.XAPPIA_API_VOLKSWAGEN, prospectObj);

        const { status, data } = res;
        const ok = status === 200;

        if (ok) return { data };
    } catch (error) {
        console.log(error);
    }
};

const handlePromises = (leads, createLead, sendLead, dealer) => {
    let promises = [];

    forEach(leads, lead => {
        const leadObj = createLead(lead);

        if (lead.lastname) {
            promises.push(sendLead(leadObj, dealer));
        }
    });

    return promises;
};

const toyotaPromises = (toyotaLeads, dealer) =>
    handlePromises(toyotaLeads, createToyotaObj, sendToyotaLead, dealer);

const volkswagenPromises = volkswagenLeads =>
    handlePromises(volkswagenLeads, createVolkswagenObj, sendVolkswagenLead);

module.exports = { toyotaPromises, volkswagenPromises };
