package com.luzdovale.reabilitah.backend.scripts;

import java.util.Random;

public class GerarCpfValido {

    public static void main(String[] args) {
        System.out.println(gerarCPF());
    }
    public static String gerarCPF() {
        Random random = new Random();
        int[] cpf = new int[11];

        for (int i = 0; i < 9; i++) {
            cpf[i] = random.nextInt(10);
        }

        cpf[9] = calcularDigito(cpf, 9);

        cpf[10] = calcularDigito(cpf, 10);

        return "" + cpf[0] + cpf[1] + cpf[2] + "."
                + cpf[3] + cpf[4] + cpf[5] + "."
                + cpf[6] + cpf[7] + cpf[8] + "-"
                + cpf[9] + cpf[10];
    }

    private static int calcularDigito(int[] cpf, int tamanho) {
        int soma = 0;

        for (int i = 0; i < tamanho; i++) {
            soma += cpf[i] * (tamanho + 1 - i);
        }

        int resto = soma % 11;

        return (resto < 2) ? 0 : 11 - resto;
    }
}
