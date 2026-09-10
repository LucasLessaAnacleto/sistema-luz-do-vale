module com.example.auladesk {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.auladesk to javafx.fxml;
    exports com.example.auladesk;
}