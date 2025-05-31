import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Result "mo:base/Result";

actor CivicChain {
    // Types
    public type UserRole = {
        #Citizen;
        #Police;
        #BarangayOfficial;
        #HeadPolice;
        #HeadBarangay;
    };

    public type ReportStatus = {
        #Submitted;
        #UnderReview;
        #InProgress;
        #Resolved;
        #Escalated;
    };

    public type ReportType = {
        #Pothole;
        #Theft;
        #Corruption;
        #TrafficViolation;
        #NoiseComplaint;
        #StreetLight;
        #Garbage;
        #Other: Text;
    };

    public type Location = {
        latitude: Float;
        longitude: Float;
        address: Text;
        barangay: Text;
    };

    public type Report = {
        id: Text;
        title: Text;
        description: Text;
        reportType: ReportType;
        location: Location;
        status: ReportStatus;
        submittedBy: Text; // User ID
        assignedTo: ?Text; // Police/Barangay Official ID
        createdAt: Int;
        updatedAt: Int;
        mediaUrls: [Text];
        isAnonymous: Bool;
    };

    public type User = {
        id: Text;
        role: UserRole;
        name: Text;
        email: Text;
        department: ?Text; // For police
        barangay: ?Text; // For barangay officials
        isActive: Bool;
        createdAt: Int;
    };

    public type Proposal = {
        id: Text;
        title: Text;
        description: Text;
        proposedBy: Text; // User ID
        barangay: Text;
        budget: Nat;
        status: {#Pending; #Approved; #Rejected; #InProgress; #Completed};
        votes: [(Text, Bool)]; // User ID, vote (true = yes, false = no)
        createdAt: Int;
        deadline: Int;
    };

    public type Announcement = {
        id: Text;
        title: Text;
        content: Text;
        author: Text; // User ID
        targetAudience: {#All; #Barangay: Text; #Police};
        createdAt: Int;
        isActive: Bool;
    };

    // Manila Barangays (sample list - can be expanded)
    private let manilaBarangays = [
        "Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5",
        "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", "Barangay 10",
        "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", "Barangay 15",
        "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20",
        "Ermita", "Intramuros", "Malate", "Paco", "Pandacan", "Port Area",
        "Quiapo", "Sampaloc", "San Andres", "San Miguel", "San Nicolas",
        "Santa Ana", "Santa Cruz", "Santa Mesa", "Tondo", "Binondo"
    ];

    // Police Stations in Manila
    private let policeStations = [
        "Manila Police District - Station 1 (Intramuros)",
        "Manila Police District - Station 2 (Ermita)",
        "Manila Police District - Station 3 (Malate)",
        "Manila Police District - Station 4 (Paco)",
        "Manila Police District - Station 5 (Pandacan)",
        "Manila Police District - Station 6 (Quiapo)",
        "Manila Police District - Station 7 (Sampaloc)",
        "Manila Police District - Station 8 (San Miguel)",
        "Manila Police District - Station 9 (Santa Ana)",
        "Manila Police District - Station 10 (Santa Cruz)",
        "Manila Police District - Station 11 (Tondo)",
        "Manila Police District - Station 12 (Binondo)"
    ];

    // State
    private stable var nextReportId: Nat = 1;
    private stable var nextUserId: Nat = 1;
    private stable var nextProposalId: Nat = 1;
    private stable var nextAnnouncementId: Nat = 1;

    private var reports = HashMap.HashMap<Text, Report>(10, Text.equal, Text.hash);
    private var users = HashMap.HashMap<Text, User>(10, Text.equal, Text.hash);
    private var proposals = HashMap.HashMap<Text, Proposal>(10, Text.equal, Text.hash);
    private var announcements = HashMap.HashMap<Text, Announcement>(10, Text.equal, Text.hash);

    // Helper functions
    private func generateId(prefix: Text, counter: Nat): Text {
        prefix # Int.toText(counter)
    };

    // User Management
    public func registerUser(name: Text, email: Text, role: UserRole, department: ?Text, barangay: ?Text): async Result.Result<Text, Text> {
        let userId = generateId("user_", nextUserId);
        nextUserId += 1;

        let user: User = {
            id = userId;
            role = role;
            name = name;
            email = email;
            department = department;
            barangay = barangay;
            isActive = true;
            createdAt = Time.now();
        };

        users.put(userId, user);
        #ok(userId)
    };

    public query func getUser(userId: Text): async ?User {
        users.get(userId)
    };

    public query func getAllUsers(): async [User] {
        Iter.toArray(users.vals())
    };

    public query func getManilaBarangays(): async [Text] {
        manilaBarangays
    };

    public query func getPoliceStations(): async [Text] {
        policeStations
    };

    // Report Management
    public func submitReport(
        title: Text,
        description: Text,
        reportType: ReportType,
        location: Location,
        submittedBy: Text,
        mediaUrls: [Text],
        isAnonymous: Bool
    ): async Result.Result<Text, Text> {
        let reportId = generateId("report_", nextReportId);
        nextReportId += 1;

        let report: Report = {
            id = reportId;
            title = title;
            description = description;
            reportType = reportType;
            location = location;
            status = #Submitted;
            submittedBy = submittedBy;
            assignedTo = null;
            createdAt = Time.now();
            updatedAt = Time.now();
            mediaUrls = mediaUrls;
            isAnonymous = isAnonymous;
        };

        reports.put(reportId, report);
        #ok(reportId)
    };

    public func updateReportStatus(reportId: Text, newStatus: ReportStatus, updatedBy: Text): async Result.Result<(), Text> {
        switch (reports.get(reportId)) {
            case null { #err("Report not found") };
            case (?report) {
                let updatedReport = {
                    report with
                    status = newStatus;
                    updatedAt = Time.now();
                };
                reports.put(reportId, updatedReport);
                #ok()
            };
        }
    };

    public func assignReport(reportId: Text, assignedTo: Text, assignedBy: Text): async Result.Result<(), Text> {
        switch (reports.get(reportId)) {
            case null { #err("Report not found") };
            case (?report) {
                let updatedReport = {
                    report with
                    assignedTo = ?assignedTo;
                    status = #InProgress;
                    updatedAt = Time.now();
                };
                reports.put(reportId, updatedReport);
                #ok()
            };
        }
    };

    public query func getReport(reportId: Text): async ?Report {
        reports.get(reportId)
    };

    public query func getAllReports(): async [Report] {
        Iter.toArray(reports.vals())
    };

    public query func getReportsByBarangay(barangay: Text): async [Report] {
        let allReports = Iter.toArray(reports.vals());
        Array.filter(allReports, func(report: Report): Bool {
            report.location.barangay == barangay
        })
    };

    public query func getReportsByStatus(status: ReportStatus): async [Report] {
        let allReports = Iter.toArray(reports.vals());
        Array.filter(allReports, func(report: Report): Bool {
            report.status == status
        })
    };

    // Proposal Management
    public func createProposal(
        title: Text,
        description: Text,
        proposedBy: Text,
        barangay: Text,
        budget: Nat,
        deadline: Int
    ): async Result.Result<Text, Text> {
        let proposalId = generateId("proposal_", nextProposalId);
        nextProposalId += 1;

        let proposal: Proposal = {
            id = proposalId;
            title = title;
            description = description;
            proposedBy = proposedBy;
            barangay = barangay;
            budget = budget;
            status = #Pending;
            votes = [];
            createdAt = Time.now();
            deadline = deadline;
        };

        proposals.put(proposalId, proposal);
        #ok(proposalId)
    };

    public func voteOnProposal(proposalId: Text, userId: Text, vote: Bool): async Result.Result<(), Text> {
        switch (proposals.get(proposalId)) {
            case null { #err("Proposal not found") };
            case (?proposal) {
                let votesBuffer = Buffer.fromArray<(Text, Bool)>(proposal.votes);
                votesBuffer.add((userId, vote));
                let newVotes = Buffer.toArray(votesBuffer);
                let updatedProposal = {
                    proposal with
                    votes = newVotes;
                };
                proposals.put(proposalId, updatedProposal);
                #ok()
            };
        }
    };

    public query func getProposal(proposalId: Text): async ?Proposal {
        proposals.get(proposalId)
    };

    public query func getAllProposals(): async [Proposal] {
        Iter.toArray(proposals.vals())
    };

    public query func getProposalsByBarangay(barangay: Text): async [Proposal] {
        let allProposals = Iter.toArray(proposals.vals());
        Array.filter(allProposals, func(proposal: Proposal): Bool {
            proposal.barangay == barangay
        })
    };

    // Announcement Management
    public func createAnnouncement(
        title: Text,
        content: Text,
        author: Text,
        targetAudience: {#All; #Barangay: Text; #Police}
    ): async Result.Result<Text, Text> {
        let announcementId = generateId("announcement_", nextAnnouncementId);
        nextAnnouncementId += 1;

        let announcement: Announcement = {
            id = announcementId;
            title = title;
            content = content;
            author = author;
            targetAudience = targetAudience;
            createdAt = Time.now();
            isActive = true;
        };

        announcements.put(announcementId, announcement);
        #ok(announcementId)
    };

    public query func getAllAnnouncements(): async [Announcement] {
        let allAnnouncements = Iter.toArray(announcements.vals());
        Array.filter(allAnnouncements, func(announcement: Announcement): Bool {
            announcement.isActive
        })
    };

    public query func getAnnouncementsByTarget(target: {#All; #Barangay: Text; #Police}): async [Announcement] {
        let allAnnouncements = Iter.toArray(announcements.vals());
        Array.filter(allAnnouncements, func(announcement: Announcement): Bool {
            announcement.isActive and (announcement.targetAudience == target or announcement.targetAudience == #All)
        })
    };

    // Analytics
    public query func getReportStatsByBarangay(barangay: Text): async {
        total: Nat;
        submitted: Nat;
        inProgress: Nat;
        resolved: Nat;
    } {
        let barangayReports = Array.filter(Iter.toArray(reports.vals()), func(r: Report): Bool { r.location.barangay == barangay });
        let total = barangayReports.size();
        let submitted = Array.filter(barangayReports, func(r: Report): Bool { r.status == #Submitted }).size();
        let inProgress = Array.filter(barangayReports, func(r: Report): Bool { r.status == #InProgress }).size();
        let resolved = Array.filter(barangayReports, func(r: Report): Bool { r.status == #Resolved }).size();

        {
            total = total;
            submitted = submitted;
            inProgress = inProgress;
            resolved = resolved;
        }
    };

    // System info
    public query func getSystemInfo(): async {
        totalReports: Nat;
        totalUsers: Nat;
        totalProposals: Nat;
        totalAnnouncements: Nat;
    } {
        {
            totalReports = reports.size();
            totalUsers = users.size();
            totalProposals = proposals.size();
            totalAnnouncements = announcements.size();
        }
    };
}