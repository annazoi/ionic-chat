
import { IonAvatar, IonCard, IonCardContent, IonCheckbox, IonChip, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getUsers } from '../../services/users';

const Group: React.FC = () => {

    const { data, isSuccess } = useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
      });

    return (
      
            <IonContent className="ion-padding">
                {data?.users.map((user:any, index:any )=>(
                    <IonCard key={index}>
                         
                        <IonCardContent className="ion-no-padding" >
                       
                            <IonItem lines="none">
                                
                                <IonAvatar slot="start">
                                    <IonImg src={user.avatar} />
                                </IonAvatar>
                                <IonLabel>{user.username}</IonLabel>
                                <IonChip slot="end" color={"primary"}>
                                    {user.phone}
                                </IonChip>
                                <IonCheckbox>
                                </IonCheckbox>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                    )
                )}
               
            </IonContent>
    );
};

export default Group;