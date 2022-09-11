const fs = require('fs/promises');

async function readFifaTeams() {
    try {
        const data = await fs.readFile('./input/playground.txt', { encoding: 'utf8' });
        const array = data.split('\n');
        console.log(array);

        let output = {
            countries: [],
            national: [],
            organizations: [],
            other: []
        };

        while(array.length > 0) {
            let section = [];
            let element = '';
            
            while (array[0] !== ' -') {
                element = array.shift();
                section.push(element);
            }

            const name = section.shift();
    
            if (isNationalTeamSection(name)) {
                output.national.push(parseNonLeagueSection(section, name));
            } else if (isOrganizationSection(name)) {
                output.organizations.push(parseCountrySection(section, name));
            } else if (isRestOfWorldSection(name)) {
                output.other.push(parseNonLeagueSection(section, name));
            } else {
                output.countries.push(parseCountrySection(section, name));
            }

            array.shift(); // Get passed the ' -'
        }

        const json = JSON.stringify(output);

        await fs.writeFile('./output/output.json', json);
    } catch (error) {
        console.log(error);
    }
}

function parseNonLeagueSection(section, name) {
    let nonLeagueSection = {
        name: name,
        clubs: []
    };

    while (section.length > 0) {
        const club = { clubName: section.shift() };
        nonLeagueSection.clubs.push(club);
    }

    return nonLeagueSection;
}

/**
 * 
 * @param {Array} section 
 * @param {string} name 
 */
function parseCountrySection(section, name) {
    let country = {
        countryName: name,
        leagues: []
    };
    
    let currentLeague = {
        clubs: []
    };

    let nextIsLeagueName = true;

    while (section.length > 0) {
        const element = section.shift();

        if (nextIsLeagueName) {
            currentLeague.leagueName = element;
            nextIsLeagueName = false;
        } else if (element === ' ') {
            nextIsLeagueName = true;
            country.leagues.push(currentLeague);
            currentLeague = {
                clubs: []
            };
        } else {
            const club = { clubName: element };
            currentLeague.clubs.push(club);
        }
    }

    country.leagues.push(currentLeague);

    return country;
}

/**
 * @param {string} name The name of the league/organization/national team.
 */
function isNationalTeamSection(name) {
    const nonCountrySections = [
        'MEN\'S NATIONAL',
        'WOMEN\'S NATIONAL'
    ];

    const nameUpper = name.toUpperCase();
    
    return nonCountrySections.includes(nameUpper);
}

/**
 * @param {string} name The name of the league/organization/national team.
 */
function isOrganizationSection(name) {
    const nonCountrySections = [
        'CONMEBOL'
    ];

    const nameUpper = name.toUpperCase();
    
    return nonCountrySections.includes(nameUpper);
}

/**
 * @param {string} name The name of the league/organization/national team.
 */
function isRestOfWorldSection(name) {
    const nonCountrySections = [
        'REST OF WORLD'
    ];

    const nameUpper = name.toUpperCase();
    
    return nonCountrySections.includes(nameUpper);
}

(async() => {
    await readFifaTeams();
})();