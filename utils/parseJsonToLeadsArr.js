const toyotaJsonToLeadsArr = excel =>
    excel.reduce((arr, obj) => {
        const {
            A: fullName,
            B: phone,
            C: mail,
            D: code,
            E: comments,
            F: providerOrigin
        } = obj;
        let arrName = [];
        let arrPhones = [];

        if (fullName) arrName = fullName.split(" ");

        if (phone) arrPhones = [].concat(phone.toString());

        const newProspect = {
            name: arrName[0],
            lastname: arrName[arrName.length - 1],
            phones: arrPhones,
            mail,
            code,
            comments,
            providerOrigin
        };

        arr.push(newProspect);
        return arr;
    }, []);

const volkswagenJsonToLeadsArr = excel =>
    excel.reduce((arr, obj) => {
        const {
            A: fullName,
            B: phone,
            C: email,
            D: teamId,
            E: product,
            F: origin,
            G: autoahorro
        } = obj;

        let arrName = [];

        if (fullName) arrName = fullName.split(" ");

        const newProspect = {
            name: arrName[0],
            lastname: arrName[arrName.length - 1],
            phone,
            email,
            teamId,
            product,
            origin,
            autoahorro
        };

        arr.push(newProspect);
        return arr;
    }, []);

module.exports = { toyotaJsonToLeadsArr, volkswagenJsonToLeadsArr };
