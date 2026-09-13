import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum EMAIL_STATUS {
    PENDENTE = 'PENDENTE',
    ENVIADO = 'ENVIADO',
    ERRO = 'ERRO',
    CANCELADO = 'CANCELADO'
}

@Entity('emails')
export class EmailEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    destinatario: string;

    @Column({nullable: false})
    assunto: string;

    @Column({nullable: true})
    corpo: string;

    @Column({nullable: true})
    anexo: string;

    @Column({nullable: true})
    nomeAnexo: string;

    @Column({nullable: false, default: EMAIL_STATUS.PENDENTE})
    status: EMAIL_STATUS;

}