import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { login } from "@/services/auth-service";
import { useRouter } from "vue-router";
import { toast, useToast } from '@/components/ui/toast/use-toast';
import { ref } from "vue";

export const formSchema = toTypedSchema(
    z.object({
        email: z.string().email(),
        password: z.string().min(1),
    })
);

export function createLoginForm() {
    const router = useRouter();
    const form = useForm({
        validationSchema: formSchema,
    });
    const isLoading = ref(false);

    const onSubmit = form.handleSubmit(async (values) => {
        isLoading.value = true;
        const loginSuccess = await login(values.email, values.password);
        isLoading.value = false;

        if (loginSuccess) {
            toast({
                description: 'Login success'
            });
            router.push("/dashboard");
        } else {
            toast({
                description: 'Login failed',
                variant: 'destructive'
            });
        }
    });

    return { onSubmit, isLoading };
}