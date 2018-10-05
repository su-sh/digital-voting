'use strict';


/**
 * Creating & Registering User to network
 * @param {org.dv.net.RegisterUser} registerUser - Registering user
 * @transaction
 */
async function RegisterUser(registerUser) {

    var citizenshipId = registerUser.citizenshipId;
    var firstName = registerUser.firstName;
    var lastName = registerUser.lastName;
    var dob = registerUser.dob;
    var sex = registerUser.sex;
    var emailId = registerUser.emailId;

    const factory = getFactory();
    const NS = 'org.dv.net';

    // create the user
    const user = factory.newResource(NS, 'User', citizenshipId);
    const userPrimaryInfo = factory.newConcept(NS, 'PrimaryInfo');
    userPrimaryInfo.firstName = firstName;
    userPrimaryInfo.lastName = lastName;
    userPrimaryInfo.dob = dob;
    userPrimaryInfo.sex = sex;
    userPrimaryInfo.emailId = emailId;
    userPrimaryInfo.citizenshipId = citizenshipId;

    user.userPassword = generatePassword();

    user.primaryInfo = userPrimaryInfo;

    // add the user
    const userRegistry = await getParticipantRegistry(NS + '.User');
    await userRegistry.addAll([user]);
}





/**
 * Creating & Registering ElectionAdmin to network
 * @param {org.dv.net.RegisterElectionAdmin} electionAdmin - Registering ElectionAdmin
 * @transaction
 */
async function RegisterElectionAdmin(electionAdmin) {

    var organizationName = electionAdmin.organizationName;
    var electionAdminPassword = electionAdmin.electionAdminPassword;
    const factory = getFactory();
    const NS = 'org.dv.net';
    // create the Appointment
    const electionAdminn = factory.newResource(NS, 'ElectionAdmin', "EA_"+electionAdmin.user.userId);

    electionAdminn.organizationName = organizationName;
    electionAdminn.electionAdminPassword = generatePassword();
    electionAdminn.user = factory.newRelationship(NS, 'User', electionAdmin.user.userId);

    const electionAdminRegistry = await getParticipantRegistry(NS + '.ElectionAdmin');
    await electionAdminRegistry.addAll([electionAdminn]);
}




/**
 * Creating & Registering ElectionAdmin to network
 * @param {org.dv.net.RegisterElection} registerElection - Registering Election
 * @transaction
 */
async function RegisterElection(registerElection) {

    var electionId = registerElection.electionId;
    var electionDetail = registerElection.electionDetail;
    var electionRegisterTime = registerElection.electionRegisterTime;
    var electionResultTime = registerElection.electionResultTime;
    const factory = getFactory();
    const NS = 'org.dv.net';

    const election = factory.newResource(NS, 'Election', electionId + "_" + registerElection.electionAdminId.electionAdminId);

    election.electionDetail = electionDetail;
    election.electionRegisterTime = electionRegisterTime;
    election.electionResultTime = electionResultTime;
    
    var voterIdArr = [];
    var candidateIdArray = [];
    election.voterId = voterIdArr;
    election.candidateId = candidateIdArray;

    election.electionAdminId = factory.newRelationship(NS, 'ElectionAdmin', registerElection.electionAdminId.electionAdminId);

    const electionRegistry = await getAssetRegistry(NS + '.Election');
    await electionRegistry.addAll([election]);
}









/**
 * Creating & Registering ElectionAdmin to network
 * @param {org.dv.net.RegisterVoter} registerVoter - Registering Voter
 * @transaction
 */
async function RegisterVoter(registerVoter) {
   
    var voterId =  registerVoter.user.userId+"_"+registerVoter.election.electionId;
    var votePasscode = generateCode();

    const factory = getFactory();
    const NS = 'org.dv.net';

    var res;

    const userRegistry = await getParticipantRegistry(NS + '.User');
    await userRegistry.exists(registerVoter.user.userId).then(function (result) {
        // here you can use the result of promiseB

        if (result) {
            res = true;
        } else {
            res = false;
        }

    });


    if (res) {

        const voter = factory.newResource(NS, 'Voter', voterId);

        voter.votePasscode = votePasscode;
        voter.election = factory.newRelationship(NS, 'Election', registerVoter.election.electionId);
        voter.user = factory.newRelationship(NS, 'User', registerVoter.user.userId);
        const voterRegistry = await getParticipantRegistry(NS + '.Voter');
        await voterRegistry.addAll([voter]);

        var voterIdArray = [];

        voterIdArray = registerVoter.election.voterId;

        voterIdArray.push(registerVoter.user.userId);
        registerVoter.election.voterId = voterIdArray;
        let assetRegistry = await getAssetRegistry(NS + '.Election');
        await assetRegistry.update(registerVoter.election);
    } else {
        throw new Error('User not registered.');
    }
}




/**
 * Creating & Registering RegisterCandidate to network
 * @param {org.dv.net.RegisterCandidate} registerCandidate - Registering Candidate
 * @transaction
 */
async function RegisterCandidate(registerCandidate) {
    /*
    asset Candidate identified by candidateId {
     --> Election election
     --> User user
     o String candidateId
     o String description
     o Integer votes default=0
    
    xtransaction:
      --> Election election
     --> User user
     o String candidateId
     o String description
     */

    var candidateId = registerCandidate.user.userId+"_"+registerCandidate.election.electionId;

    const factory = getFactory();
    const NS = 'org.dv.net';


    const userRegistry = await getParticipantRegistry(NS + '.User');
    await userRegistry.exists(registerCandidate.user.userId).then(function (result) {
        // here you can use the result of promiseB

        if (result) {
            res = true;
        } else {
            res = false;
        }
    });

    if (res) {
      
        const candidate = factory.newResource(NS, 'Candidate', candidateId);
        candidate.election = factory.newRelationship(NS, 'Election', registerCandidate.election.electionId);
        candidate.user = factory.newRelationship(NS, 'User', registerCandidate.user.userId);
        candidate.description = registerCandidate.description;

        const candidateRegistry = await getParticipantRegistry(NS + '.Candidate');
        await candidateRegistry.addAll([candidate]);

        var candidateIdArray = [];

        candidateIdArray = registerCandidate.election.candidateId;

        candidateIdArray.push(registerCandidate.user.userId);
        registerCandidate.election.candidateId = candidateIdArray;
        let assetRegistry = await getAssetRegistry(NS + '.Election');
        await assetRegistry.update(registerCandidate.election);

    } else {
        throw new Error('User not registered.');
    }
}



/*
   transaction MakeVote
*/




/**
 * Creating & Registering RegisterCandidate to network
 * @param {org.dv.net.MakeVote} makeVote - Voting
 * @transaction
 */
async function MakeVote(makeVote) {
    /*
      --> Election election
      --> Voter voter
      --> Candidate candidate
    */
  
    var voter = makeVote.voter;
    // get candidate
    var candidate = makeVote.candidate;
    var election = makeVote.election;
    if (voter.voted) {
        throw new Error('Already voted');
    } else {

        candidate.votes = candidate.votes + 1;
        voter.voted = true;
        const factory = getFactory();
        const NS = 'org.dv.net';

        let candidateRegistry = await getParticipantRegistry(NS + '.Candidate');
        await candidateRegistry.update(candidate);
        let voterRegistry = await getParticipantRegistry(NS + '.Voter');
        await voterRegistry.update(voter);
    }
}




function generateCode() {
    var length = 4,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}