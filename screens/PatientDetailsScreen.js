import * as React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {Card} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import AppHeader from '../components/AppHeader';

export default class PatientDetailsScreen extends React.Component{

    constructor(props){
        super(props);
        this.state={
            patient_name:this.props.navigation.getParam("details")["name"],
            patient_problem:this.props.navigation.getParam("details")["problem"],
            patient_contact:this.props.navigation.getParam("details")["contact"],
            patient_address:this.props.navigation.getParam("details")["address"],
            userId:firebase.auth().currentUser.email
        }
    }

    helpPatient=async()=>{
        db.collection("accepted_request").add({
            doctor_id:this.state.userId,
            patient_id:this.props.navigation.getParam("details")["email_id"],
            request_id:this.props.navigation.getParam("details")["request_id"],
            patient_name:this.state.patient_name,
            patient_address:this.state.patient_address,
            patient_contact:this.state.patient_contact,
            patient_problem:this.state.patient_problem
        })
        db.collection("requests").where("request_id", "==", this.props.navigation.getParam("details")["request_id"])
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("requests").doc(doc.id).update({
                    status:"request_accepted"
                })
            })
        })
    }

    render(){
        return(
            <KeyboardAvoidingView style={{flex:1, backgroundColor:"#A0E5FF"}}>
                <AppHeader title="Patient Details" />
                <ScrollView>
                    <Card>
                        <Card>
                            <Text>Name: {this.state.patient_name}</Text>
                        </Card>
                        <Card>
                            <Text>Problem: {this.state.patient_problem}</Text>
                        </Card>
                        <Card>
                            <Text>Contact: {this.state.patient_contact}</Text>
                        </Card>
                        <Card>
                            <Text>Address: {this.state.patient_address}</Text>
                        </Card>
                    </Card>
                    <View>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={()=>{
                                this.helpPatient()
                                this.props.navigation.navigate("MyConsultations")
                            }}
                        >
                            <Text style={styles.buttonText}>Help patient</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle:{
        alignSelf:'center',
        padding:10,
        backgroundColor:"#0070FF",
        marginTop:60,
        width:240,
        alignItems:'center',
        borderRadius:14,
        shadowColor:"black",
        shadowOffset:{width:0, height:8},
        shadowOpacity:0.44,
        elevation:0.40,
    },
    buttonText:{
        color:"white",
        fontSize:20,
        fontWeight:'bold'
    }
})