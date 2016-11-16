app.filter('orderObjectBy', function() {
    return function(obj, field, reverse) {
        
        var filtered = [];
        
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                filtered.push(obj[key]);
            }
        }
        
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        
        if(reverse) filtered.reverse();
        
        return filtered;
        
    };
    
});

app.filter('withoutZeroCategories', function() {
    return function(categories) {

        var array = [];

        for (var key in categories) {
            if (categories.hasOwnProperty(key)) {
                array.push(categories[key]);
            }
        }

        return array.filter(function(category) {
            return category.money > 0;
        });

    };
});