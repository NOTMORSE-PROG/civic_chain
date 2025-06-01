export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Announcement = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'createdAt' : IDL.Int,
    'isActive' : IDL.Bool,
    'targetAudience' : IDL.Variant({
      'All' : IDL.Null,
      'Police' : IDL.Null,
      'Barangay' : IDL.Text,
    }),
    'author' : IDL.Text,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Variant({
      'Approved' : IDL.Null,
      'Rejected' : IDL.Null,
      'InProgress' : IDL.Null,
      'Completed' : IDL.Null,
      'Pending' : IDL.Null,
    }),
    'title' : IDL.Text,
    'votes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool)),
    'createdAt' : IDL.Int,
    'barangay' : IDL.Text,
    'description' : IDL.Text,
    'deadline' : IDL.Int,
    'budget' : IDL.Nat,
    'proposedBy' : IDL.Text,
  });
  const ReportStatus = IDL.Variant({
    'UnderReview' : IDL.Null,
    'Submitted' : IDL.Null,
    'InProgress' : IDL.Null,
    'Escalated' : IDL.Null,
    'Resolved' : IDL.Null,
  });
  const ReportType = IDL.Variant({
    'Garbage' : IDL.Null,
    'NoiseComplaint' : IDL.Null,
    'StreetLight' : IDL.Null,
    'Corruption' : IDL.Null,
    'TrafficViolation' : IDL.Null,
    'Pothole' : IDL.Null,
    'Theft' : IDL.Null,
    'Other' : IDL.Text,
  });
  const Location = IDL.Record({
    'latitude' : IDL.Float64,
    'barangay' : IDL.Text,
    'longitude' : IDL.Float64,
    'address' : IDL.Text,
  });
  const Report = IDL.Record({
    'id' : IDL.Text,
    'status' : ReportStatus,
    'title' : IDL.Text,
    'assignedTo' : IDL.Opt(IDL.Text),
    'createdAt' : IDL.Int,
    'isAnonymous' : IDL.Bool,
    'submittedBy' : IDL.Text,
    'description' : IDL.Text,
    'reportType' : ReportType,
    'updatedAt' : IDL.Int,
    'mediaUrls' : IDL.Vec(IDL.Text),
    'location' : Location,
  });
  const UserRole = IDL.Variant({
    'Police' : IDL.Null,
    'BarangayOfficial' : IDL.Null,
    'HeadPolice' : IDL.Null,
    'HeadBarangay' : IDL.Null,
    'Citizen' : IDL.Null,
  });
  const User = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'role' : UserRole,
    'barangay' : IDL.Opt(IDL.Text),
    'isActive' : IDL.Bool,
    'email' : IDL.Text,
    'department' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'assignReport' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'createAnnouncement' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Variant({
            'All' : IDL.Null,
            'Police' : IDL.Null,
            'Barangay' : IDL.Text,
          }),
        ],
        [Result_1],
        [],
      ),
    'createProposal' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Int],
        [Result_1],
        [],
      ),
    'getAllAnnouncements' : IDL.Func([], [IDL.Vec(Announcement)], ['query']),
    'getAllProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getAllReports' : IDL.Func([], [IDL.Vec(Report)], ['query']),
    'getAllUsers' : IDL.Func([], [IDL.Vec(User)], ['query']),
    'getAnnouncementsByTarget' : IDL.Func(
        [
          IDL.Variant({
            'All' : IDL.Null,
            'Police' : IDL.Null,
            'Barangay' : IDL.Text,
          }),
        ],
        [IDL.Vec(Announcement)],
        ['query'],
      ),
    'getManilaBarangays' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getPoliceStations' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getProposal' : IDL.Func([IDL.Text], [IDL.Opt(Proposal)], ['query']),
    'getProposalsByBarangay' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Proposal)],
        ['query'],
      ),
    'getReport' : IDL.Func([IDL.Text], [IDL.Opt(Report)], ['query']),
    'getReportStatsByBarangay' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'resolved' : IDL.Nat,
            'total' : IDL.Nat,
            'submitted' : IDL.Nat,
            'inProgress' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getReportsByBarangay' : IDL.Func([IDL.Text], [IDL.Vec(Report)], ['query']),
    'getReportsByStatus' : IDL.Func(
        [ReportStatus],
        [IDL.Vec(Report)],
        ['query'],
      ),
    'getSystemInfo' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalAnnouncements' : IDL.Nat,
            'totalReports' : IDL.Nat,
            'totalProposals' : IDL.Nat,
            'totalUsers' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUser' : IDL.Func([IDL.Text], [IDL.Opt(User)], ['query']),
    'registerUser' : IDL.Func(
        [IDL.Text, IDL.Text, UserRole, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'submitReport' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          ReportType,
          Location,
          IDL.Text,
          IDL.Vec(IDL.Text),
          IDL.Bool,
        ],
        [Result_1],
        [],
      ),
    'updateReportStatus' : IDL.Func(
        [IDL.Text, ReportStatus, IDL.Text],
        [Result],
        [],
      ),
    'voteOnProposal' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
