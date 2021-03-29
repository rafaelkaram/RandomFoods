import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Receita } from './Receita';
import { Usuario } from './Usuario';

@Entity('avaliacao')
@Unique([ 'usuario', 'receita' ])
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nota: number;

  @CreateDateColumn()
  data: Date;

  @ManyToOne(() => Usuario, usuario => usuario.avaliacoes)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Receita, receita => receita.avaliacoes)
  @JoinColumn({ name: 'id_receita' })
  receita: Receita;
}