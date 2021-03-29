import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Receita } from './Receita';

@Entity('comentario')
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  valor: string;

  @CreateDateColumn()
  data: Date;

  @ManyToOne(() => Comentario, comentario => comentario.comentarioPai)
  @JoinColumn({ name: 'id_pai' })
  comentarioPai: Comentario;

  @ManyToOne(() => Usuario, usuario => usuario.comentarios)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Receita, receita => receita.comentarios)
  @JoinColumn({ name: 'id_receita' })
  receita: Receita;
}