Feature: E2E Testing

    @E2E
    Scenario Outline: E2E Test for Employee Management through UI
        Given user navigates to "https://opensource-demo.orangehrmlive.com/"
        When user enters username "Admin" and password "admin123"
        And user clicks on the login button
        And user clicks on the side menu button
        And user clicks on the admin page button
        Then get the total number of records found
        When user clicks on add employee button
        And user fill in the new employee details with the following data:
            | userRole     | <userRole>     |
            | employeeName | <employeeName> |
            | status       | <status>       |
            | username     | <username>     |
            | password     | <password>     |
        And user clicks on save button
        Then verify that the new record is increased by 1 or more
        When user searches for employee with username "<username>"
        And user deletes the employee record
        Then verify that the new record is decreased by 1 or more
        Examples:
            | userRole | employeeName | status  | username    | password      |
            | Admin    | John         | Enabled | OmarElbably | Password123!! |

    @api
    Scenario Outline: API Test for Candidate Management
        # Given user navigates to "https://opensource-demo.orangehrmlive.com/"
        # When user enters username "Admin" and password "admin123"
        # And user clicks on the login button
        When user logins via API with username "Admin" and password "admin123"
        And user adds a candidate via API with the following details:
            | First Name     | <firstName>     |
            | Middle Name    | <middleName>    |
            | Last Name      | <lastName>      |
            | Email          | <email>         |
            | Contact Number | <contactNumber> |
            | Keywords       | <keywords>      |
            | Comment        | <comment>       |
        Then the candidate should be created successfully via API
        When user retrieves the candidate list via API
        And user finds the candidate with first name "<firstName>" and last name "<lastName>" via API
        And user deletes the candidate via API
        Then the candidate should be deleted successfully via API
        And the candidate with first name "<firstName>" and last name "<lastName>" should not exist in the system
        Examples:
            | firstName | middleName | lastName | email                 | contactNumber | keywords            | comment       |
            | Omar      | mid        | last     | omar.last@example.com | +1234567890   | automation, testing | Added via API |
