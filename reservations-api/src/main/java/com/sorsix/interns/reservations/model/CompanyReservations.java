package com.sorsix.interns.reservations.model;

public class CompanyReservations {

    private String companyName;
    private Long reservationsCount;

    public CompanyReservations() { }

    public CompanyReservations(String companyName, Long reservationsCount) {
        this.companyName = companyName;
        this.reservationsCount = reservationsCount;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getReservationsCount() {
        return reservationsCount;
    }

    public void setReservationsCount(Long reservationsCount) {
        this.reservationsCount = reservationsCount;
    }
}
