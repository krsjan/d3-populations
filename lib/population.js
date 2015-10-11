var Population = function (population) {
    "use strict";

    var self = {},
        percent = (n, m) => { return m * (100 / n); },
        age = (p) => {
            let birthYear = new Date(p.employmentDate).getYear();
            let thisYear = new Date().getYear();

            return thisYear - birthYear;
        };

    self.males = function() {
        return population.data.filter(function (employee) {
            if (employee.gender === 'M') {
                return true;
            }
            return false;
        });
    };

    self.females = function () {
        return population.data.filter(function (employee) {
            if (employee.gender === 'F') {
                return true;
            }
            return false;
        });
    };

    self.malesPercent = function () {
        return percent(population.data.length, self.males().length);
    };

    self.femalesPercent = function () {
        return percent(population.data.length, self.females().length);
    };

    self.others = function () {
        return population.data.filter(function (employee) {
            if (employee.gender !== 'F' && employee.gender !== 'M') {
                return true;
            }
            return false;
        });
    };

    self.genderDistribution = function () {
        return {
            name: population.name,
            label: d3.min(population.data, (d) => { return age(d); }) + " - " + d3.max(population.data, (d) => { return age(d); }),
            females: self.females().length,
            males: self.males().length
        };
    };

    self.genderDistributionByPercent = function () {
        return {
            name: population.name,
            label: d3.min(population.data, (d) => { return age(d); }) + " - " + d3.max(population.data, (d) => { return age(d); }),
            females: self.femalesPercent(),
            males: self.malesPercent()
        };
    };

    self.genderDistributionByAge = function () {
        let ageBound = (p) => {
            return Math.round((age(p) * 3) / 10);
        };

        let ageDistribution = utl.sortBy(population.data, (x, y) => {
            return ageBound(x) === ageBound(y);
        });

        return ageDistribution.sort((a, b) => {
                return age(b[0]) - age(a[0]);
            })
            .map((a) => {
                return Population({name: "Age" +  age(a[0]), data: a}).genderDistribution();
            });
    };

    self.updateGenders = function (genders) {
        return Population({
            name: population.name,
            data: population.data.map(function (employee) {
                if (employee.gender !== 'F' && employee.gender !== 'M') {
                    var approximation = genders.filter(function (gender) {
                        return employee.firstName === gender.name;
                    })[0];

                    if (approximation) {
                        employee.gender = approximation.gender;
                    };
                };
                return employee;
            })
        });
    };

    return self;
};