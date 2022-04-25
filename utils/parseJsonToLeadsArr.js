const parseJsonToLeadsArr = excel =>
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

        if (fullName) {
            arrName = fullName.split(" ");
        }

        if (phone) {
            arrPhones = [].concat(phone.toString());
        }

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

module.exports = parseJsonToLeadsArr;
