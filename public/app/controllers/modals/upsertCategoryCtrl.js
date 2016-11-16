app.controller('upsertCategoryCtrl', function($scope, $rootScope, $modalInstance, $http, category, edit_mode, category_type) {

    $scope.addingCategory = false;

    $scope.category = category;
    $scope.nameCategory = category && edit_mode ? category.name || "" : "";
    $scope.editMode = edit_mode;
    $scope.category_type = category_type;

    $scope.addCategory = function() {

        $scope.addingCategory = true;

        var data = {
            category: {
                name: $scope.nameCategory,
                parent_id: category ? category.id || "" : ""
            }
        };
         
        $http.post("/api/categories/" + $scope.category_type + "/add", data).success(function(result) {

            var category = {
                id: result._id,
                name: result.name,
                moneyOfCategory: 0,
                countRecords: 0
            };

            if (result.parent_id) {
                category.parent = result.parent_id;
            }
            
            $modalInstance.close(category);
            $scope.addingCategory = false;
        
        }).error(function(err) {
        
            console.log(err);
            $scope.addingCategory = false;
        
        });

    };
    
    $scope.updateCategory = function() {

        $scope.addingCategory = true;

        $http.post("/api/categories/update/" + $scope.category.id, {
            category: {
                name: $scope.nameCategory
            }
        }).success(function(result) {

            console.log(result);
            
            $modalInstance.close({
                status_code: 200,
                category: {
                    id: result.category.id,
                    name: result.category.name
                }
            });

            $scope.addingCategory = false;

        }).error(function(err) {

            console.log(err);
            $scope.addingCategory = false;

        });
        
    };

    $scope.removeCategory = function() {

        $scope.addingCategory = true;
        
        $http.delete("/api/categories/delete/" + $scope.category.id).success(function(result) {

            $modalInstance.close({
                status_code: 410, // 410 - Gone (удален)
                category_id: result.category_id
            });

            $scope.addingCategory = false;

        }).error(function(err) {

            console.log(err);
            $scope.addingCategory = false;

        });
        
    };

    $scope.close = function() {

        $modalInstance.dismiss("Cancel");

    };

});